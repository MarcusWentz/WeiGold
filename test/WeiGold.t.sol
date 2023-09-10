// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/WeiGold.sol";

contract WeiGoldTest is Test {
    WeiGold public weigold;

    function setUp() public {
        weigold = new WeiGold();
    }

    function testIncrement() public {
        int256 priceEthUsd = weigold.getLatestEthUsdPrice();
        assertGt(priceEthUsd,0);
    }

    function testSetNumber() public {
        uint256 priceEthGold = weigold.getLatestWeiGoldPrice();
        assertGt(priceEthGold,0);
    }

    function testSetNumbera() public {
        assertEq(weigold.vendingSlotCount(0),0);
        weigold.OwnerUpdateSlots(0,1);
        assertEq(weigold.vendingSlotCount(0),1);
    }
}
