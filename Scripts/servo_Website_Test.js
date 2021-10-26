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
const contractAddress_JS = '0x20E5C8AfC26Bec865d749393308E433436757664'
const contractABI_JS =
[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"valueChangeEventWenjs","type":"uint256"},{"indexed":false,"internalType":"int256","name":"feeChange","type":"int256"}],"name":"contractStateChangeEvent","type":"event"},{"inputs":[],"name":"BuwWTI","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuySilver","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"update_Scale_Fee","type":"int256"}],"name":"OwnerChangeScaleFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"update_State","type":"uint256"}],"name":"OwnerChangeStateServoRefill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"OwnerWithdrawAllWEI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"Scale_Fee","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"State","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_ETH_USD_Price","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Gold_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Oil_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Silver_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
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
  contractDefined_JS.methods.State().call((err, balance) => {
  	console.log(balance)
  	
	if(balance & 1){
		console.log("SERVO ONE OPEN")
		piblaster.setPwm(servoControlPinOne, pulseWidthMax); 
	}
	else{
    		console.log("SERVO ONE CLOSED")
		piblaster.setPwm(servoControlPinOne, pulseWidthMin); 
	}
	if(balance & 2){
		console.log("SERVO TWO OPEN")
		piblaster.setPwm(servoControlPinTwo, pulseWidthMax); 
	}
	else{
	    	console.log("SERVO TWO CLOSED")
		piblaster.setPwm(servoControlPinTwo, pulseWidthMin); 
	}
	if(balance & 4){
		console.log("SERVO THREE OPEN")
		piblaster.setPwm(servoControlPinThree, pulseWidthMax); 
	}
	else{
	    	console.log("SERVO THREE CLOSED")
		piblaster.setPwm(servoControlPinThree, pulseWidthMin); 
	}
	if(balance > 7 || balance < 0)
	{
		console.log("CONTRACT SHOULD BE 0 TO 7 ONLY!")
	}
	setTimeout(() => {}, timeMilliSec);
  })
}

console.log("Contract starting value:")
checkValueLatest();

//Subscribe to event.
contractDefined_JS.events.contractStateChangeEvent({
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


