//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("getCurrentAccountConnected").innerHTML =  "Ethereum address not connceted. Please refresh and click the top button to connect."

//If Metamask is not detected the user will be told to install Metamask.
function detectMetamaskInstalled(){
  try{
     ethereum.isMetaMask
  }
  catch(missingMetamask) {
     alert("Metamask not detected in browser! Install Metamask browser extension, then refresh page!")
  }
}

//Alert user to connect their Metamask address to the site before doing any transactions.
function checkAddressMissingMetamask() {
  if(accounts.length == 0) {
    alert("No address from Metamask found. Click the top button to connect your Metamask account then try again without refreshing the page.")
  }
}

//Function called for getting Metamask accounts on Rinkeby. Used in every button in case the user forgets to click the top button.
function enableMetamaskOnRinkeby() {
  //Get account details from Metamask wallet.
  getAccount();
  //Check if user is on the Rinkeby testnet. If not, alert them to change to Rinkeby.
  if(window.ethereum.networkVersion != 4){
    alert("You are not on the Rinkeby Testnet! Please switch to Rinkeby and refresh page.")
  }
}

//When the page is opened check for error handling issues.
detectMetamaskInstalled()

//Connect to Metamask.
const ethereumButton = document.querySelector('.enableEthereumButton');
ethereumButton.addEventListener('click', () => {
    detectMetamaskInstalled()
    enableMetamaskOnRinkeby()
});

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  document.getElementById("getCurrentAccountConnected").innerHTML = accounts[0]
}

//Make Metamask the client side Web3 provider. Needed for tracking live events.
const web3 = new Web3(window.ethereum)
//Now build the contract with Web3.
const contractAddress_JS = '0x20E5C8AfC26Bec865d749393308E433436757664'
const contractABI_JS =
[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"valueChangeEventWenjs","type":"uint256"},{"indexed":false,"internalType":"int256","name":"feeChange","type":"int256"}],"name":"contractStateChangeEvent","type":"event"},{"inputs":[],"name":"BuwWTI","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuySilver","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"update_Scale_Fee","type":"int256"}],"name":"OwnerChangeScaleFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"update_State","type":"uint256"}],"name":"OwnerChangeStateServoRefill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"OwnerWithdrawAllWEI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"Scale_Fee","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"State","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_ETH_USD_Price","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Gold_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Oil_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Silver_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

//Get the latest value for State.
contractDefined_JS.methods.State().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueStateSmartContract").innerHTML =  balance
  }
})

////Get the latest value for Scale_Fee
contractDefined_JS.methods.Scale_Fee().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueScale_FeeSmartContract").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueScale_FeeSmartContract").innerHTML =  balance/10 + "%"
  }
})

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeStateInContractEvent = document.querySelector('.changeStateInContractEvent');
changeStateInContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  //uint cannot be negative, force to absolute value.
  var inputContractText =  Math.abs(document.getElementById("setValueStateSmartContract").value);
  //Check if value is an integer. If not throw an error.
  if(Number.isInteger(inputContractText) == false){
    alert("Input value is not an integer! Only put an integer for input.")
  }
  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: contractAddress_JS,
          gasPrice: '2540be400',
          gas:  'C3500',
          data: contractDefined_JS.methods.OwnerChangeStateServoRefill(inputContractText).encodeABI()
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeScale_FeeInContractEvent = document.querySelector('.changeScale_FeeInContractEvent');
changeScale_FeeInContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  //uint cannot be negative, force to absolute value.
  var inputContractText =  Math.abs(document.getElementById("setValueScale_FeeSmartContract").value);
  //Check if value is an integer. If not throw an error.
  if(Number.isInteger(inputContractText) == false){
    alert("Input value is not an integer! Only put an integer for input.")
  }
  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: contractAddress_JS,
          gasPrice: '2540be400',
          gas:  'C3500',
          data: contractDefined_JS.methods.OwnerChangeScaleFee(inputContractText).encodeABI()
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
});

//OwnerWithdrawAllWEI FUNCTION
// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeOwnerWithdrawAllWEIContract = document.querySelector('.changeOwnerWithdrawAllWEIContract');
changeOwnerWithdrawAllWEIContract.addEventListener('click', () => {
  checkAddressMissingMetamask()
  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: contractAddress_JS,
          gasPrice: '2540be400',
          gas:  'C3500',
          data: contractDefined_JS.methods.OwnerWithdrawAllWEI().encodeABI()
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
});
//


//Get the latest event. Once the event is triggered, website will update value.
contractDefined_JS.events.contractStateChangeEvent({
     fromBlock: 'latest'
 }, function(error, eventResult){})
 .on('data', function(eventResult){
   console.log(eventResult)
     //Call the get function to get the most accurate present values.
     contractDefined_JS.methods.State().call((err, balance) => {
      document.getElementById("getValueStateSmartContract").innerHTML =  balance
     })
     contractDefined_JS.methods.Scale_Fee().call((err, balance) => {
         document.getElementById("getValueScale_FeeSmartContract").innerHTML =  balance/10 + "%"
     })
   })
 .on('changed', function(eventResult){
     // remove event from local database
 })
 .on('error', console.error);

 //Changing the integer state in a function which will fire off an event.
 //Make sure values are in hex or Metamask will fail to load.
 //DO NOT SET A VALUE UNLESS THE CONTRACT NEEDS IT FOR MSG.VALUE REQUIRE STATEMENTS
 // const sendEthButton = document.querySelector('.sendEthButton');
 // sendEthButton.addEventListener('click', () => {
 //   checkAddressMissingMetamask()
 //   ethereum
 //     .request({
 //       method: 'eth_sendTransaction',
 //       params: [
 //         {
 //           from: accounts[0],
 //           to: '0xc1202e7d42655F23097476f6D48006fE56d38d4f',
 //           value: '0x29a2241af62c0',
 //           gasPrice: '0x5F0000000',
 //           gas: '0x5208',
 //         },
 //       ],
 //     })
 //     .then((txHash) => console.log(txHash))
 //     .catch((error) => console.error);
 // });
