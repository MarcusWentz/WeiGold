//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("enableEthereumButton").innerHTML =  "Connect Metamask"

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
const ethereumButton = document.querySelector('#enableEthereumButton');
ethereumButton.addEventListener('click', () => {
    detectMetamaskInstalled()
    enableMetamaskOnRinkeby()
});

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  document.getElementById("enableEthereumButton").innerText = accounts[0].substr(0,5) + "..." +  accounts[0].substr(38,4)
}

//Make Metamask the client side Web3 provider. Needed for tracking live events.
const web3 = new Web3(window.ethereum)
//Now build the contract with Web3.
const contractAddress_JS = '0x46f9A3C317AB291419ceF90284EbDf13Cf440277'
const contractABI_JS = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"int256","name":"valueChangeEventWenjs","type":"int256"}],"name":"ScaleFee_StateChangeEvent","type":"event"},{"inputs":[],"name":"BuyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuyOil","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuySilver","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"update_Scale_Fee","type":"int256"}],"name":"OwnerChangeScaleFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"update_State","type":"int256"}],"name":"OwnerChangeState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"OwnerWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ScaleFee_State","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_ETH_USD_Price","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Gold_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Oil_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Silver_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

//Get the latest value for State.
contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee_State) => {
  if(ScaleFee_State === undefined){
    document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getValueStateSmartContract").className = "text-danger"
  }
  else{
    document.getElementById("getValueStateSmartContract").innerHTML =  "State = " + (ScaleFee_State&7)
  }
})

web3.eth.getBalance(contractAddress_JS, function(err, balance) {
  if(balance === undefined){
    document.getElementById("getSmartContractBalance").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getSmartContractBalance").className = "text-danger"
  }
  else{
    document.getElementById("getSmartContractBalance").innerHTML = "Balance = " + (balance/(10**18)) + " ETH"
  }
})

////Get the latest value for Scale_Fee
contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee_State) => {
  if(ScaleFee_State === undefined){
    document.getElementById("getValueScale_FeeSmartContract").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getValueScale_FeeSmartContract").className = "text-danger"
  }
  else{
    document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + (ScaleFee_State>>3)/10 + "%"
  }
})

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeStateInContractEvent = document.querySelector('#changeStateInContractEvent');
changeStateInContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee_State) => {
    contractDefined_JS.methods.Owner().call((err, address) => {
    if(accounts[0] == address.toLowerCase() ){
      if((document.getElementById("setValueStateSmartContract").value%(1)) === (0) ){
        if(document.getElementById("setValueStateSmartContract").value >= (0)) {
          if(document.getElementById("setValueStateSmartContract").value != (ScaleFee_State&7)) {
            if(document.getElementById("setValueStateSmartContract").value < 8) {
                ethereum
                  .request({
                    method: 'eth_sendTransaction',
                    params: [
                      {
                        //Metamask calculates gas limit and price.
                        from: accounts[0],
                        to: contractAddress_JS,
                        data: contractDefined_JS.methods.OwnerChangeState(document.getElementById("setValueStateSmartContract").value).encodeABI()
                      },
                    ],
                  })
                  .then((txHash) => console.log(txHash))
                  .catch((error) => console.error);
                }
                else{
                  alert("State must be less than 8!")
                }
            }
            else{
              alert("Don't waste gas setting the same value.")
             }
           }
        else{
          alert("Integer must be positive.")
        }
      }
      else{
        alert("Input must be an integer!")
      }
    }
    else {
      alert("Connected address does not match Owner address! Connect as Owner then try again.")
    }
   })
  })

});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const WithdrawFundsInContract = document.querySelector('#WithdrawFundsInContract');
WithdrawFundsInContract.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.Owner().call((err, address) => {
    web3.eth.getBalance(contractAddress_JS, function(err, balance) {
    if(accounts[0] == address.toLowerCase() ){
      if(balance > 0) {
              ethereum
                .request({
                  method: 'eth_sendTransaction',
                  params: [
                    {
                      //Metamask calculates gas limit and price.
                      from: accounts[0],
                      to: contractAddress_JS,
                      data: contractDefined_JS.methods.OwnerWithdraw().encodeABI()
                    },
                  ],
                })
                .then((txHash) => console.log(txHash))
                .catch((error) => console.error);
      }
      else{
          alert("No Etheruem to withdraw. ")
        }
      }
    else{
      alert("Connected address does not match Owner address! Connect as Owner then try again.")
     }
    })
  })

});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeScale_FeeInContractEvent = document.querySelector('#changeScale_FeeInContractEvent');
changeScale_FeeInContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.Owner().call((err, address) => {
    ////Get the latest value for Scale_Fee
    contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee_State) => {
    if(accounts[0] == address.toLowerCase() ){
      if((document.getElementById("setValueScale_FeeSmartContract").value%(1)) === (0) ) {
        if(document.getElementById("setValueScale_FeeSmartContract").value >= (0) ) {
          if(document.getElementById("setValueScale_FeeSmartContract").value != (ScaleFee_State>>3)) {
            ethereum
              .request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    //Metamask calculates gas limit and price.
                    from: accounts[0],
                    to: contractAddress_JS,
                    data: contractDefined_JS.methods.OwnerChangeScaleFee(document.getElementById("setValueScale_FeeSmartContract").value).encodeABI()
                  },
                ],
              })
              .then((txHash) => console.log(txHash))
              .catch((error) => console.error);
            }
            else{
              alert("Don't waste gas setting the same value.")
            }
        }
        else {
          alert("Integer must be positive.")
        }
      }
      else{
        alert("Input must be an integer!")
      }
    }
    else{
      alert("Connected address does not match Owner address! Connect as Owner then try again.")
    }
    })
  })
});

//Get the latest event. Once the event is triggered, website will update value.
contractDefined_JS.events.ScaleFee_StateChangeEvent({
     fromBlock: 'latest'
 }, function(error, eventResult){})
 .on('data', function(eventResult){
   console.log(eventResult)
     //Call the get function to get the most accurate present values.
     contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee_State) => {
      document.getElementById("getValueStateSmartContract").innerHTML =   "State = " + (ScaleFee_State&7)
     })
     contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee_State) => {
     document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + (ScaleFee_State>>3)/10 + "%"
     })
     web3.eth.getBalance(contractAddress_JS, function(err, balance) {
         document.getElementById("getSmartContractBalance").innerHTML = "Balance = " + (balance/(10**18)) + " ETH"
     })
   })
 .on('changed', function(eventResult){
     // remove event from local database
 })
 .on('error', console.error);
