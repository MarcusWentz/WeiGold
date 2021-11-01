pragma solidity ^0.8.9;

contract MockWeiGold{

    int public ScaleFee_State; // Slot 1: 32/32. ScaleFee(ScaleFee_State>>3). State=(ScaleFee_State&7). Keeping int instead of uint and uint96 to make price math conversions work and cheaper.

    event ScaleFee_StateChangeEvent(
        address indexed from,
        int indexed valueChangeEventWenjs
    );

    function BuyGold() public payable  {
        require(((ScaleFee_State)&4)==0,  "Gold is sold out already!");
        require(msg.value ==400000000000000000, "MSG.VALUE must be equal to getLatest_WEI_Gold_Price");
        ScaleFee_State+=4;
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }

    function BuySilver() public payable {
        require((ScaleFee_State&2)==0, "Silver is sold out already!");
        require(msg.value == 20000000000000000, "MSG.VALUE must be equal to getLatest_WEI_Silver_Price()!");
        ScaleFee_State+=2;
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }
    function BuyOil() public payable  {
        require((ScaleFee_State&1)==0, "Oil is sold out already!");
        require(msg.value == 5000000000000000, "MSG.VALUE must be equal to getLatest_WEI_Oil_Price()!");
        ScaleFee_State+=1;
        emit ScaleFee_StateChangeEvent(msg.sender, ScaleFee_State);
    }

}
