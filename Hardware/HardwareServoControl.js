//Source material: https://www.dappuniversity.com/articles/web3-js-intro
//Need to import web3 Linux:
//sudo npm install web3
//HIDE KEYS WITH "Linux Environment Variables" https://www.youtube.com/watch?v=himEMfYQJ1w

//Connect to Web3.
const Web3 = require('web3')
//Use WSS to get live event data instead of polling constantly,
const rpcURL = process.env.optimismSepoliaWSS // Your RPC URL goes here
//Connect to Web3 with Infura WSS.
const web3 = new Web3(rpcURL)
//Define contract
const contractAddress_JS = '0x8aa8d378effa946a8d8c6214116027cf40714e93'
const contractABI_JS = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"EtherNotSent","type":"error"},{"inputs":[],"name":"MsgValueTooSmall","type":"error"},{"inputs":[],"name":"OraclePriceFeedZero","type":"error"},{"inputs":[],"name":"SlotEmpty","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"SlotsUpdated","type":"event"},{"inputs":[],"name":"MAX_BPS","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SCALE_FEE","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"slot","type":"uint256"}],"name":"buyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getLatestEthUsdPrice","outputs":[{"internalType":"int256","name":"latestEthUsdPrice","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWeiGoldPrice","outputs":[{"internalType":"uint256","name":"latestWeiGoldPrice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"slot","type":"uint256"},{"internalType":"uint256","name":"count","type":"uint256"}],"name":"ownerUpdateSlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vendingSlotCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
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
