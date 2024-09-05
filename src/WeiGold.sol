// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "chainlink/v0.8/interfaces/AggregatorV3Interface.sol"; // "forge install smartcontractkit/chainlink-brownie-contracts" and set custom "chainlink" remapping in file https://chainstack.com/using-chainlinks-vrf-with-foundry/

interface IWeiGold{

    //Custom errors.
    error slotEmpty();
    error oraclePriceFeedZero();
    error msgValueTooSmall();
    error notOwner();
    error etherNotSent();

    //Events.
    event slotsUpdated();

}

contract WeiGold is IWeiGold { 

    // @notice Fee range defined in MAX_BPS is 10000 for 2 decimals places like Uniswap. 
    // Example with houseEdgeFeePercent = 30: 30/10000 = 3/1000 = 0.3%.
    // @dev Uniswap treats bps and ticks as the concept.
    // https://support.uniswap.org/hc/en-us/articles/21069524840589-What-is-a-tick-when-providing-liquidity
    int256 public constant MAX_BPS = 10000; 
    // @notice 0.3% fee like Uniswap.
    int256 public constant SCALE_FEE = 30; 

    address public immutable OWNER;// Slot 0: 32/32 Owner never changes, use immutable to save gas. 

    mapping (uint256 => uint256) public vendingSlotCount;

    AggregatorV3Interface internal priceFeedETHforUSD;
    AggregatorV3Interface internal priceFeedUSDforGold;

    constructor() {
        OWNER = msg.sender;
        // Sepolia testnet pricefeeds (hard to bridge to rollups on testnets).
        // Pricefeed addresses:
        // https://docs.chain.link/data-feeds/price-feeds/addresses?network=optimism&page=1#optimism-sepolia
        priceFeedETHforUSD =  AggregatorV3Interface(0x61Ec26aA57019C486B10502285c5A3D4A4750AD7);
        priceFeedUSDforGold = AggregatorV3Interface(0xa6932B792e4b4FfA1e78e63671f42d0aff02eD73);
    }
    
    function getLatestEthUsdPrice() public view returns (int) {
        (
            // uint80 roundID, 
            // int price, 
            // uint startedAt, 
            // uint timeStamp, 
            // uint80 answeredInRound
             ,int price, , ,
        ) = priceFeedETHforUSD.latestRoundData();
        return price;
    }
    function getLatestWeiGoldPrice() public view returns (uint) {
        (
            // uint80 roundID, 
            // int price, 
            // uint startedAt, 
            // uint timeStamp, 
            // uint80 answeredInRound
             ,int price, , ,
        ) = priceFeedUSDforGold.latestRoundData();
        // return uint( (price*(10**18)*((10000+scaleFee)/10000)) / getLatestEthUsdPrice() ); // 0.3% fee like Uniswap.
        return uint( ( (price)*(1 ether)*((MAX_BPS+SCALE_FEE)/MAX_BPS)) / getLatestEthUsdPrice() ); // 0.3% fee like Uniswap.

    }

    function BuyGold(uint256 slot) public payable  {
        if(vendingSlotCount[slot] == 0) revert slotEmpty();
        if(getLatestWeiGoldPrice() == 0) revert oraclePriceFeedZero();
        if(msg.value < getLatestWeiGoldPrice()) revert msgValueTooSmall();  // Price for MSG.VALUE can change in mempool. Allow user to overpay then refund them.     
        vendingSlotCount[slot] -= 1; // Avoid using prefix or postfix operators to avoid execution order complexity.
        if(msg.value > getLatestWeiGoldPrice() ) { 
            (bool sentUser, ) = payable(msg.sender).call{value: msg.value -  getLatestWeiGoldPrice()}("");
            if(sentUser == false) revert etherNotSent(); 
        }
        (bool sentOwner, ) = payable(OWNER).call{value: address(this).balance}("");
        if(sentOwner == false) revert etherNotSent();        
        emit slotsUpdated();
    }
    
    function OwnerUpdateSlots(uint256 slot, uint count) public {
        if(msg.sender == OWNER){
            vendingSlotCount[slot] = count;
            emit slotsUpdated();
            return;
        } revert notOwner();
    }

}
