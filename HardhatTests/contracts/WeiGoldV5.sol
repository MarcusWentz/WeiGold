// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract WeiGold{
    
    AggregatorV3Interface internal priceFeedETHforUSD;
    AggregatorV3Interface internal priceFeedWEIforGold;
    AggregatorV3Interface internal priceFeedWEIforSilver;
    AggregatorV3Interface internal priceFeedWEIforOil;

    int public Scale_Fee;
    uint public State;
    address public Owner;

    constructor() {
        Owner = msg.sender;
        //Pricefeed addresses: https://docs.chain.link/docs/ethereum-addresses/
        priceFeedETHforUSD =  AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        priceFeedWEIforGold = AggregatorV3Interface(0x81570059A0cb83888f1459Ec66Aad1Ac16730243);
        priceFeedWEIforSilver = AggregatorV3Interface(0x9c1946428f4f159dB4889aA6B218833f467e1BfD);
        priceFeedWEIforOil = AggregatorV3Interface(0x6292aA9a6650aE14fbf974E5029f36F95a1848Fd);
    }
    
    function getLatest_ETH_USD_Price() public view returns (int) {
        (
            uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound
        ) = priceFeedETHforUSD.latestRoundData();
        return (price);
    }
    
    function getLatest_WEI_Gold_Price() public view returns (uint) {
        (
            uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound
        ) = priceFeedWEIforGold.latestRoundData();
        return uint( (price*(10**18)*((1000+Scale_Fee)/1000)) / getLatest_ETH_USD_Price() );    
    } 
    function getLatest_WEI_Silver_Price() public view returns (uint) {
        (
            uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound
        ) = priceFeedWEIforSilver.latestRoundData();
        return uint( (price*(10**18)*((1000+Scale_Fee)/1000)) / getLatest_ETH_USD_Price() );
    }
    function getLatest_WEI_Oil_Price() public view returns (uint) {
        (
            uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound
        ) = priceFeedWEIforOil.latestRoundData();
        return uint( (price*(10**18)*((1000+Scale_Fee)/1000)) / getLatest_ETH_USD_Price() );
    }
    
    modifier ContractOwnnerCheck() {
        require(msg.sender == Owner, "Only contract owner (deployer) can access this function.");
        _;
    }

    event contractStateChangeEvent(
        uint indexed date,
        address indexed from,
        uint valueChangeEventWenjs,
        int feeChange
    );
    
    function BuyGold() public payable {
        require((State&4)==0,  "Gold is sold out already!");
        require(getLatest_WEI_Gold_Price() > 0, "Contract is unable to read Chainlink pricefeeds.");
        require(msg.value == getLatest_WEI_Gold_Price(), "MSG.VALUE must be equal to getLatest_WEI_Gold_Price");
        State+=4;
        emit contractStateChangeEvent(block.number, msg.sender, State, Scale_Fee);
    }
    
    function BuySilver() public payable {
        require((State&2)==0, "Silver is sold out already!");
        require(getLatest_WEI_Silver_Price() > 0, "Contract is unable to read Chainlink pricefeeds.");
        require(msg.value == getLatest_WEI_Silver_Price(), "MSG.VALUE must be equal to getLatest_WEI_Silver_Price()!");
        State+=2;
        emit contractStateChangeEvent(block.number, msg.sender, State, Scale_Fee);
    }
        
    function BuyOil() public payable {
        require((State&1)==0, "Oil is sold out already!");
        require(getLatest_WEI_Oil_Price() > 0, "Contract is unable to read Chainlink pricefeeds.");
        require(msg.value == getLatest_WEI_Oil_Price(), "MSG.VALUE must be equal to getLatest_WEI_Oil_Price()!");
        State+=1;
        emit contractStateChangeEvent(block.number, msg.sender, State, Scale_Fee);
    }

    function OwnerChangeScaleFee(int update_Scale_Fee) public ContractOwnnerCheck {
        require(Scale_Fee != update_Scale_Fee, "Input value is already the same as Scale_Fee!");
        Scale_Fee = update_Scale_Fee;
        emit contractStateChangeEvent(block.number, msg.sender, State, Scale_Fee);
    }
    
    function OwnerChangeStateServoAutoWithdraw(uint update_State) public ContractOwnnerCheck {
        require(State != update_State, "Input value is already the same as State!");
        require(update_State < 8, "Input must be less than 8!!");
        State = update_State;
        if(address(this).balance> 0){
            payable(Owner).transfer(address(this).balance);
        }
        emit contractStateChangeEvent(block.number, msg.sender, State, Scale_Fee);
    }
    
}
