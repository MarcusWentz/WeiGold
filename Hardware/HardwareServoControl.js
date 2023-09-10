//Source material: https://www.dappuniversity.com/articles/web3-js-intro
//Need to import web3 Linux:
//sudo npm install web3
//HIDE KEYS WITH "Linux Environment Variables" https://www.youtube.com/watch?v=himEMfYQJ1w

//Connect to Web3.
const Web3 = require('web3')
//Use WSS to get live event data instead of polling constantly,
const rpcURL = process.env.rinkebyWebSocketSecureEventsInfuraAPIKey // Your RPC URL goes here
//Connect to Web3 with Infura WSS.
const web3 = new Web3(rpcURL)
//Define contract
const contractAddress_JS = '0x44F3E9288682385E08433dB8E95B2aab9075DD83'
const contractABI_JS =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"int256","name":"valueChangeEventWenjs","type":"int256"}],"name":"ScaleFee_StateChangeEvent","type":"event"},{"inputs":[],"name":"BuyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuyOil","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuySilver","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"int256","name":"update_Scale_Fee","type":"int256"}],"name":"OwnerChangeScaleFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"update_State","type":"int256"}],"name":"OwnerChangeState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"OwnerClaimSelfDestructedETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getLatest_ETH_USD_Price","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Gold_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Oil_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Silver_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ScaleFee_State","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}]
const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

//SERVO TEST
//https://github.com/sarfata/pi-blaster
//Build and install directly from source
var piblaster = require('pi-blaster.js');
const timeMilliSec = 1000;
const pulseWidthMin = 0.05;
const pulseWidthMax = 0.35;
const servoControlPinOne = 17; //[Hardware pin 11: Oil]
const servoControlPinTwo = 23; //[Hardware pin 16, Silver]
const servoControlPinThree = 27; //[Hardware pin 13, Gold]

//get() contract value,
function checkValueLatest() {
  contractDefined_JS.methods.ScaleFee_State().call((err, balance) => {
  	console.log(balance&7)

	if(balance & 1){
	   	console.log("SERVO ONE OPEN")
		piblaster.setPwm(servoControlPinOne, pulseWidthMin);
	}
	else{
		console.log("SERVO ONE CLOSED")
		piblaster.setPwm(servoControlPinOne, pulseWidthMax);
	}
	if(balance & 2){
		console.log("SERVO TWO OPEN")
		piblaster.setPwm(servoControlPinTwo, pulseWidthMin);
	}
	else{
		console.log("SERVO TWO CLOSED")
		piblaster.setPwm(servoControlPinTwo, pulseWidthMax);
	}
	if(balance & 4){
		console.log("SERVO THREE OPEN")
		piblaster.setPwm(servoControlPinThree, pulseWidthMin);
	}
	else{
		console.log("SERVO THREE CLOSED")
		piblaster.setPwm(servoControlPinThree, pulseWidthMax);
	}
	if((balance&7) > 7 || (balance&7) < 0)
	{
		console.log("CONTRACT SHOULD BE 0 TO 7 ONLY!")
	}
	setTimeout(() => {}, timeMilliSec);
  })
}

console.log("Contract starting value:")
checkValueLatest();

//Subscribe to event.
contractDefined_JS.events.ScaleFee_StateChangeEvent({
     fromBlock: 'latest'
 }, function(error, eventResult){})
 .on('data', function(eventResult){
    //console.log(eventResult)
   //Call the get function to get the most accurate present state for the value.
   console.log("EVENT DETECTED! NEW STATE VALUE: ")
   checkValueLatest();
   })
 .on('changed', function(eventResult){
     // remove event from local database
 })
 .on('error', console.error);
