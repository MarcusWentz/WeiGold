// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// @notice Remix IDE import
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// @dev "forge install smartcontractkit/chainlink-brownie-contracts" 
// and set custom "chainlink" remapping in file 
// https://chainstack.com/using-chainlinks-vrf-with-foundry/
import {AggregatorV3Interface} from "chainlink/v0.8/interfaces/AggregatorV3Interface.sol"; 
// @dev "forge install rari-capital/solmate --no-commit"
import {Owned} from "solmate/auth/Owned.sol";

interface IWeiGold{

    //Custom errors.
    error SlotEmpty();
    error OraclePriceFeedZero();
    error MsgValueTooSmall();
    error EtherNotSent();
    // error NotOwner();

    //Events.
    event SlotsUpdated();

}

contract WeiGold is IWeiGold, Owned { 

    // @notice Fee range defined in MAX_BPS is 10000 for 2 decimals places like Uniswap. 
    // Example with houseEdgeFeePercent = 30: 30/10000 = 3/1000 = 0.3%.
    // @dev Uniswap treats bps and ticks as the concept.
    // https://support.uniswap.org/hc/en-us/articles/21069524840589-What-is-a-tick-when-providing-liquidity
    int256 public constant MAX_BPS = 10000; 
    // @notice 0.3% fee like Uniswap.
    int256 public constant SCALE_FEE = 30; 

    // address public immutable OWNER;// Slot 0: 32/32 Owner never changes, use immutable to save gas. 

    // @notice Vending machine lookup table for how much gold is left per selected slot.
    mapping (uint256 => uint256) public vendingSlotCount;

    // @notice Chainlink pricefeed contracts to call.
    AggregatorV3Interface internal priceFeedETHforUSD;
    AggregatorV3Interface internal priceFeedUSDforGold;

    constructor() Owned(msg.sender) {
        // OWNER = msg.sender;
        // @dev Bridge ETH from Sepolia to Optimism Sepolia:
        // https://superbridge.app/op-sepolia
        // @dev Pricefeed addresses for Optimism Sepolia:
        // https://docs.chain.link/data-feeds/price-feeds/addresses?network=optimism&page=1#optimism-sepolia
        // ETH/USD
        priceFeedETHforUSD =  AggregatorV3Interface(0x61Ec26aA57019C486B10502285c5A3D4A4750AD7);
        // XAU/USD (Gold/USD)
        priceFeedUSDforGold = AggregatorV3Interface(0xa6932B792e4b4FfA1e78e63671f42d0aff02eD73);
    }
    
    // @dev ETH/USD chainlink pricefeed external call.
    function getLatestEthUsdPrice() public view returns (int256 latestEthUsdPrice) {
        (
            // uint80 roundID, 
            // int price, 
            // uint startedAt, 
            // uint timeStamp, 
            // uint80 answeredInRound
             ,int256 price, , ,
        ) = priceFeedETHforUSD.latestRoundData();
        return price;
    }

    // @dev Convert ETH/USD and Gold/USD to be ETH/Gold in units wei (Wei/Gold).
    function getLatestWeiGoldPrice() public view returns (uint256 latestWeiGoldPrice) {
        (
            // uint80 roundID, 
            // int price, 
            // uint startedAt, 
            // uint timeStamp, 
            // uint80 answeredInRound
             ,int256 price, , ,
        ) = priceFeedUSDforGold.latestRoundData();
        // @dev (USD/Gold)/(USD/ETH) = (ETH/Gold) = (Wei/Gold).
        // Scale the numerator by the vending machine fee before dividing. 
        // return uint( (price*(10**18)*((10000+scaleFee)/10000)) / getLatestEthUsdPrice() ); // 0.3% fee like Uniswap.
        return uint256( ( (price)*(1 ether)*((MAX_BPS+SCALE_FEE)/MAX_BPS)) / getLatestEthUsdPrice() ); // 0.3% fee like Uniswap.

    }

    // @notice Users can buy gold from a vending machine slot that isn't empty.
    // @param slot - Vending machine slot to buy gold from. 
    function buyGold(uint256 slot) public payable  {
        // @dev Save the results from getLatestWeiGoldPrice to avoid doing conversions every call. 
        uint256 latestWeiGoldPrice = getLatestWeiGoldPrice();
        if(vendingSlotCount[slot] == 0) revert SlotEmpty();
        // @dev Emergency revert if the oracle is hacked. 
        if(latestWeiGoldPrice == 0) revert OraclePriceFeedZero();
        // @dev Price for msg.value can change while the user's transaction is in the mempool. Allow user to overpay then refund them.     
        if(msg.value < latestWeiGoldPrice) revert MsgValueTooSmall();  
        // @dev Avoid using prefix or postfix operators to avoid execution order complexity.
        // Here we use a compound operator instead (similar behavior as prefix operator with updating return the value right away).
        vendingSlotCount[slot] -= 1; 
        // @dev Send the refund amount to the user.
        // Based on this ENS design pattern for ETHRegistrarController.renew():
        // https://github.com/ensdomains/ens-contracts/blob/staging/contracts/ethregistrar/ETHRegistrarController.sol#L217-L224
        if(msg.value > latestWeiGoldPrice) { 
            (bool sentUser, ) = payable(msg.sender).call{value: msg.value -  latestWeiGoldPrice}("");
            if(sentUser == false) revert EtherNotSent(); 
        }
        // @notice Send the payment to the owner.
        (bool sentOwner, ) = payable(owner).call{value: address(this).balance}("");
        if(sentOwner == false) revert EtherNotSent();        
        emit SlotsUpdated();
    }

    // @notice Owner updates slot counts.
    // @param slot - Vending machine slot select for updating the count. 
    // @param count - New count value that will be stored. 
    function ownerUpdateSlots(uint256 slot, uint256 count) public onlyOwner {
        vendingSlotCount[slot] = count;
        emit SlotsUpdated();
    }

    // function ownerUpdateSlots(uint256 slot, uint256 count) public {
    //     if(msg.sender == OWNER){
    //         vendingSlotCount[slot] = count;
    //         emit SlotsUpdated();
    //         return;
    //     } revert NotOwner();
    // }

}
