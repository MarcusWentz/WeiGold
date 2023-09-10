// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/WeiGold.sol";

//Run tests with:
//forge test --fork-url $sepoliaInfuraHttps
//forge coverage --fork-url $sepoliaInfuraHttps --report lcov && genhtml lcov.info -o report --branch-coverage

contract WeiGoldTest is Test { 
    WeiGold public weigold;

    //Functions fallback and receive used when the test contract is sent msg.value to prevent the test from reverting.
    fallback() external payable {}     // Fallback function is called when msg.data is not empty
    receive() external payable {}      // Function to receive Ether. msg.data must be empty

    function setUp() public {
        weigold = new WeiGold();
        assertEq(weigold.scaleFee(),3);
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
        weigold.OwnerUpdateSlots(0,1);
        assertEq(weigold.vendingSlotCount(0),1);
    }

    function testOwnerUpdateSlotsNotOwner() public {
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        vm.expectRevert(notOwner.selector);    //Revert if not the owner. Custom error from SimpleStorage.
        weigold.OwnerUpdateSlots(0,1);
    }

    function testBuyGoldSlotEmpty() public {
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        assertEq(weigold.vendingSlotCount(0),0);
        vm.expectRevert(slotEmpty.selector);    //Revert if not the owner. Custom error from SimpleStorage.
        weigold.BuyGold(0);
    }

    function testBuyGoldMsgValueTooSmall() public {
        testOwnerUpdateSlotsValid();
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        assertEq(weigold.vendingSlotCount(0),1);
        vm.expectRevert(msgValueTooSmall.selector);    //Revert if not the owner. Custom error from SimpleStorage.
        weigold.BuyGold(0);
    }

    function testBuyGoldValidWithPriceRefund() public {
        testOwnerUpdateSlotsValid();
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        uint256 prankBalance = address(0).balance;
        assertGt(prankBalance,3 ether);
        assertEq(weigold.vendingSlotCount(0),1);
        weigold.BuyGold{value:3 ether}(0);
    }

    function testBuyGoldValidWithNoPriceRefund() public {
        testOwnerUpdateSlotsValid();
        vm.startPrank(address(0)); //Change the address to not be the owner. The owner is address(this) in this context.
        uint256 prankBalance = address(0).balance;
        uint256 priceEthGold = weigold.getLatestWeiGoldPrice();
        assertGt(prankBalance,priceEthGold);
        assertEq(weigold.vendingSlotCount(0),1);
        weigold.BuyGold{value:priceEthGold}(0);
    }

}
