# WeiGold: Fair Value Commodities Vending Machine

## Overview

WeiGold ensures fair, transparent vending for physical gold, silver and oil\
based on Chainlink's commodities pricefeed aggregators.

Solo project by Marcus Wentz.

Chainlink Hackathon Fall 2021.

## WeiGold Youtube presentation with demo [https://www.youtube.com/watch?v=nxwqg_YGh0c]:\
[![Watch the video](https://github.com/MarcusWentz/WeiGold/blob/main/Images/VIDEO.png)](https://www.youtube.com/watch?v=nxwqg_YGh0c)

## WeiGold's structure:\
<img src="https://github.com/MarcusWentz/WeiGold/blob/main/Images/Overview_Structure.png" alt="Overview_Structure"/>

## Hardware used:\
-Raspberry Pi 4 [Quantity: 1]\
-S90 Servo Motors [Quantity: 3]\
-A cardboard box [Quantity: 1]
  
## Wiring diagram:\
<img src="https://github.com/MarcusWentz/WeiGold/blob/main/Images/Wiring.png" alt="Wiring"/>

## Hardware Setup Instructions:\
1a.Install web3.js and pi-blaster.js with Node.js on wired Raspberry Pi 4\
1b.web3.js: npm install web3\
1c.pi-blaster.js:  Build and install directly from source: https://github.com/sarfata/pi-blaster \
2.Have the "HardwareServoControl.js" script running on the wired Raspberry Pi 4\
3.Connect to site with Metamask on Sepolia [make sure you have some free Sepolia Ethereum to modify contract states]\
(you can create your own custom contract by redeploying on Remix and changing address and ABI for FrontEnd and Servo scripts)\
4.Interact with the contract and watch the servos move based on contract State!
  
## Contract source code published at deployed Optimism Sepolia address with Etherscan:

https://sepolia-optimism.etherscan.io/address/0x090b750b9b5251828e16360fd69100dc4c674e71#code

## Website live on GitHub pages:

https://marcuswentz.github.io/WeiGold/index.html? 

## Run website locally with 

```
npx http-server
```

## Contract deployed and verified in Foundry with command 
```
forge create src/WeiGold.sol:WeiGold \
--private-key $devTestnetPrivateKey \
--rpc-url $optimismSepoliaHTTPS \
--etherscan-api-key $optimismEtherscanApiKey \
--verify 
```