// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/WeiGold.sol";

contract WeiGoldTest is Test {
    WeiGold public weigold;

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
        //address(this);
    }

}
