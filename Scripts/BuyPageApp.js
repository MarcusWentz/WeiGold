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

////Get the latest value for Scale_Fee
contractDefined_JS.methods.Scale_Fee().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueScale_FeeSmartContract").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + balance/10 + "%"
  }
})

////Get the latest WEI_Gold_Price price
contractDefined_JS.methods.getLatest_WEI_Gold_Price().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueWEI_Gold_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueWEI_Gold_Price").innerHTML =   balance/(10**18) + " ETH"
  }
})

////Get the latest getValueWEI_Silver_Price price
contractDefined_JS.methods.getLatest_WEI_Silver_Price().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueWEI_Silver_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueWEI_Silver_Price").innerHTML =  balance/(10**18) + " ETH"
  }
})

////Get the latest getValueWEI_Silver_Price price
contractDefined_JS.methods.getLatest_WEI_Silver_Price().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueWEI_Silver_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueWEI_Silver_Price").innerHTML = balance/(10**18) + " ETH"
  }
})

////Get the latest getValueWEI_Silver_Price price
contractDefined_JS.methods.getLatest_WEI_Oil_Price().call((err, balance) => {
  if(balance === undefined){
    document.getElementById("getValueWEI_Oil_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getValueWEI_Oil_Price").innerHTML = balance/(10**18) + " ETH"
  }
})

//BuyGold button
const changeBuyGold = document.querySelector('.changeBuyGold');
changeBuyGold.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.getLatest_WEI_Gold_Price().call((err, balance) => {
      ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: accounts[0],
              to: contractAddress_JS,
              gasPrice: '2540be400',
              gas:  'C3500',
              data: contractDefined_JS.methods.BuyGold().encodeABI(),
              //UPDATE VALUE
              value: web3.utils.toHex(balance)
              },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
  })

});

//BuySilver button
const changeBuySilver = document.querySelector('.changeBuySilver');
changeBuySilver.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.getLatest_WEI_Silver_Price().call((err, balance) => {
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: contractAddress_JS,
            gasPrice: '2540be400',
            gas:  'C3500',
            //UPDATE VALUE
            data: contractDefined_JS.methods.BuySilver().encodeABI(),
            value: web3.utils.toHex(balance)
            },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error);
  })

});

//BuySilver button
//
//
//
//
//
//
//UPDATE CONTRACT BuwWTI SHOULD BE BuyWTI
const changeBuyOil = document.querySelector('.changeBuyOil');
changeBuyOil.addEventListener('click', () => {
  checkAddressMissingMetamask()


    contractDefined_JS.methods.getLatest_WEI_Oil_Price().call((err, balance) => {
      ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: accounts[0],
              to: contractAddress_JS,
              gasPrice: '2540be400',
              gas:  'C3500',
              //UPDATE FUNCTION TYPO
              data: contractDefined_JS.methods.BuwWTI().encodeABI(),
              value: web3.utils.toHex(balance)
              },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    })

});

//Get the latest event. Once the event is triggered, website will update value.
contractDefined_JS.events.contractStateChangeEvent({
     fromBlock: 'latest'
 }, function(error, eventResult){})
 .on('data', function(eventResult){
   console.log(eventResult)
     //Get latest Scale_Fee after event.
     contractDefined_JS.methods.Scale_Fee().call((err, balance) => {
     document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + balance/10 + "%"
     })
   })
 .on('changed', function(eventResult){
     // remove event from local database
 })
 .on('error', console.error);
