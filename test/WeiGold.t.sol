// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import "forge-std/Test.sol";
import {WeiGold, IWeiGold} from "../src/WeiGold.sol";

contract WeiGoldTest is Test, IWeiGold { 

    WeiGold public weigold;

    //Functions fallback and receive used when the test contract is sent msg.value to prevent the test from reverting.
    fallback() external payable {}     // Fallback function is called when msg.data is not empty
    receive() external payable {}      // Function to receive Ether. msg.data must be empty

    function setUp() public {
        weigold = new WeiGold();
        assertEq(weigold.MAX_BPS(),10000);
        assertEq(weigold.SCALE_FEE(),30);
        assertEq(weigold.owner(),address(this));
    }

    function testOracleEthUsdPrice() public {
        int256 priceEthUsd = weigold.getLatestEthUsdPrice();
        assertGt(priceEthUsd,0);
    }

    function testOracleEthGoldPrice() public {
        uint256 priceEthGold = weigold.getLatestWeiGoldPrice();
        assertGt(priceEthGold,0);
    }

    function testOwnerUpdateSlotsValid() public {
        assertEq(weigold.vendingSlotCount(0),0);
        weigold.ownerUpdateSlots(0,1);
        assertEq(weigold.vendingSlotCount(0),1);
    }

    function testOwnerUpdateSlotsNotOwner() public {
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        // vm.expectRevert(NotOwner.selector);    //Revert if not the owner. Custom error from SimpleStorage.
        vm.expectRevert("UNAUTHORIZED");    //Revert if not the owner. Custom error from SimpleStorage.
        weigold.ownerUpdateSlots(0,1);
    }

    function testBuyGoldSlotEmpty() public {
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        assertEq(weigold.vendingSlotCount(0),0);
        vm.expectRevert(SlotEmpty.selector);    //Revert if not the owner. Custom error from SimpleStorage.
        weigold.buyGold(0);
    }

    function testBuyGoldMsgValueTooSmall() public {
        testOwnerUpdateSlotsValid();
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        assertEq(weigold.vendingSlotCount(0),1);
        vm.expectRevert(MsgValueTooSmall.selector);    //Revert if not the owner. Custom error from SimpleStorage.
        weigold.buyGold(0);
    }

    function testBuyGoldValidWithPriceRefund() public {
        testOwnerUpdateSlotsValid();
        uint256 priceEthGold = weigold.getLatestWeiGoldPrice();
        deal(address(0),2*priceEthGold);
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        uint256 prankBalanceBeforeRefund = address(0).balance;
        assertEq(weigold.vendingSlotCount(0),1);
        weigold.buyGold{value: priceEthGold + 1}(0);
        assertEq(address(0).balance,prankBalanceBeforeRefund-priceEthGold);
    }

    function testBuyGoldValidWithNoPriceRefund() public {
        testOwnerUpdateSlotsValid();
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        uint256 prankBalance = address(0).balance;
        uint256 priceEthGold = weigold.getLatestWeiGoldPrice();
        assertGt(prankBalance,priceEthGold);
        assertEq(weigold.vendingSlotCount(0),1);
        weigold.buyGold{value:priceEthGold}(0);
    }

}
