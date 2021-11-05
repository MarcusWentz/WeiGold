# WeiGold: Fair Value Commodties Vending Machine

WeiGold ensures fair, transparent vending for physical gold, silver and oil\
based on Chainlink's commodities pricefeed aggregators.

WeiGold Youtube presentation with demo:\
[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/vt5fpE0bzSY)
[![Watch the video](https://github.com/MarcusWentz/WeiGold/blob/main/Images/VIDEO.png)](https://www.youtube.com/watch?v=mDhl4KZngug)

WeiGold's structure:\
<img src="https://github.com/MarcusWentz/WeiGold/blob/main/Images/Overview_Structure.png" alt="Overview_Structure"/>

Hardware used:\
-Rasberry Pi 4\
-S90 Servo Motors [3 of them]\
-A cardboard box
  
Wiring diagram:\
<img src="https://github.com/MarcusWentz/WeiGold/blob/main/Images/Wiring.png" alt="Wiring"/>

Instructions:\
1a.Install web3.js and pi-blaster.js with Node.js on wired Rasberry Pi 4\
1b.web3.js: npm install web3\
1c.[pi-blaster.js:  Build and install directly from source: https://github.com/sarfata/pi-blaster]\
2.Have the "HardwareServoControl.js" script running on the wired Rasberry Pi 4\
3.Connect to site with Metamask on Rinkeby [make sure you have some free Rinkeby Ethereum to modify contract states]\
(you can create your own custom contract by redeploying on Remix and changing address and ABI for FrontEnd and Servo scripts)\
4.Interact with the contract and watch the servos move based on contract State!
  
Contract source code published at deployed Rinkeby address with Etherscan:\
https://rinkeby.etherscan.io/address/0x46f9a3c317ab291419cef90284ebdf13cf440277#code

Live site on IPFS+Filecoin with Fleek [if IPFS gateway goes down, use another IPFS gateway, use Github pages or run locally]:\
______[MAKE PUBLIC] 3.FLEEK:USED "OTHER" FOR FORMAT OTHERWISE FRONT END WON'T APPEAR_____________

_________4.MAKE VIDEO PUBLIC WITH SUBMISSION AFTER FLEEK LINK ADDED___________

Solo project by Marcus Wentz.

Chainlink Hackathon Fall 2021.
