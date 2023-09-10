// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "chainlink/v0.8/interfaces/AggregatorV3Interface.sol"; // "forge install smartcontractkit/chainlink-brownie-contracts" and set custom "chainlink" remapping in file https://chainstack.com/using-chainlinks-vrf-with-foundry/

error slotEmpty();
error oraclePriceFeedZero();
error msgValueTooSmall();
error notOwner();
error etherNotSent();

contract WeiGold { 

    AggregatorV3Interface internal priceFeedETHforUSD;
    AggregatorV3Interface internal priceFeedUSDforGold;

    address public immutable owner;// Slot 0: 32/32 Owner never changes, use immutable to save gas. 
    int public constant scaleFee = 3; // thousandth percent 
    mapping (uint256 => uint256) public vendingSlotCount;

    event slotsUpdated();

    constructor() {
        owner = msg.sender;
        //Sepolia testnet pricefeeds (hard to bridge to rollups on testnets).
        priceFeedETHforUSD =  AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); //Pricefeed addresses: https://docs.chain.link/data-feeds/price-feeds/addresses/?network=optimism&page=1
        priceFeedUSDforGold = AggregatorV3Interface(0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea);
    }
    
    function getLatestEthUsdPrice() public view returns (int) {
        (
            uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound
        ) = priceFeedETHforUSD.latestRoundData();
        return price;
    }
    function getLatestWeiGoldPrice() public view returns (uint) {
        (
            uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound
        ) = priceFeedUSDforGold.latestRoundData();
        return uint( (price*(10**18)*((1000+scaleFee)/1000)) / getLatestEthUsdPrice() ); // 0.3% fee like Uniswap.
    }

    function BuyGold(uint256 slot) public payable  {
        if(vendingSlotCount[slot] == 0) revert slotEmpty();
        if(getLatestWeiGoldPrice() == 0) revert oraclePriceFeedZero();
        if(msg.value < getLatestWeiGoldPrice()) revert msgValueTooSmall();  // Price for MSG.VALUE can change in mempool. Allow user to overpay then refund them.     
        --vendingSlotCount[slot];
        if(msg.value > getLatestWeiGoldPrice() ) { 
            (bool sentUser, ) = payable(msg.sender).call{value: msg.value -  getLatestWeiGoldPrice()}("");
            if(sentUser == false) revert etherNotSent(); 
        }
        (bool sentOwner, ) = payable(owner).call{value: address(this).balance}("");
        if(sentOwner == false) revert etherNotSent();        
        emit slotsUpdated();
    }
    
    function OwnerUpdateSlots(uint256 slot, uint count) public {
        if(msg.sender == owner){
            vendingSlotCount[slot] = count;
            emit slotsUpdated();
            return;
        } revert notOwner();
    }

}
