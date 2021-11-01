// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MockWeiGold{

    int public ScaleFee_State; // Slot 1: 32/32. ScaleFee(ScaleFee_State>>3). State=(ScaleFee_State&7). Keeping int instead of uint and uint96 to make price math conversions work and cheaper.
    address public immutable Owner;// Slot 2: 32/32 Owner never changes, use immutable to save gas.

    constructor() {
        Owner = msg.sender;
    }

    modifier ContractOwnnerCheck() {
        require(msg.sender == Owner, "Only contract owner (deployer) can access this function.");
        _;
    }

    event ScaleFee_StateChangeEvent(
        address indexed from,
        int indexed valueChangeEventWenjs
    );

    function getLatest_ETH_USD_Price() public view returns (int) {
        return 4000;
    }
    function getLatest_WEI_Gold_Price() public view returns (uint) {
        return uint( (1600*(10**18)*((1000+(ScaleFee_State>>3))/1000)) / getLatest_ETH_USD_Price() ); //Shift by 3 to get scale
    }
    function getLatest_WEI_Silver_Price() public view returns (uint) {
        return uint( (20*(10**18)*((1000+(ScaleFee_State>>3))/1000)) / getLatest_ETH_USD_Price() ); //Shift by 3 to get scale
    }
    function getLatest_WEI_Oil_Price() public view returns (uint) {
        return uint( (80*(10**18)*((1000+(ScaleFee_State>>3))/1000)) / getLatest_ETH_USD_Price() );
    }

    function BuyGold() public payable  {
        require(((ScaleFee_State)&4)==0,  "Gold is sold out already!");
        require(msg.value == getLatest_WEI_Gold_Price(), "MSG.VALUE must be equal to getLatest_WEI_Gold_Price");
        ScaleFee_State+=4;
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }

    function BuySilver() public payable {
        require((ScaleFee_State&2)==0, "Silver is sold out already!");
        require(msg.value == getLatest_WEI_Silver_Price(), "MSG.VALUE must be equal to getLatest_WEI_Silver_Price()!");
        ScaleFee_State+=2;
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }
    function BuyOil() public payable  {
        require((ScaleFee_State&1)==0, "Oil is sold out already!");
        require(msg.value == getLatest_WEI_Oil_Price(), "MSG.VALUE must be equal to getLatest_WEI_Oil_Price()!");
        ScaleFee_State+=1;
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }
    function OwnerChangeScaleFee(int update_Scale_Fee) public ContractOwnnerCheck {
        require( (ScaleFee_State>>3)!= update_Scale_Fee, "Input value is already the same as Scale_Fee!");
        ScaleFee_State = (update_Scale_Fee<<3)+(ScaleFee_State&7); //Update state.
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }

}
