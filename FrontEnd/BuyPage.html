//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("getCurrentAccountConnected").innerHTML =  "Click the top button to connect."
document.getElementById("getCurrentAccountConnected").className = "text-danger"

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
  document.getElementById("getCurrentAccountConnected").innerHTML = accounts[0]
  document.getElementById("getCurrentAccountConnected").className = "text-warning"
}

//Make Metamask the client side Web3 provider. Needed for tracking live events.
const web3 = new Web3(window.ethereum)
//Now build the contract with Web3.
const contractAddress_JS = '0x9c503b4a67a59a055Ea2030AaFfCD5934ce5195F'
const contractABI_JS = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"int256","name":"valueChangeEventWenjs","type":"int256"}],"name":"ScaleFee_StateChangeEvent","type":"event"},{"inputs":[],"name":"BuyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuyOil","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"BuySilver","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"Owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"update_Scale_Fee","type":"int256"}],"name":"OwnerChangeScaleFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"update_State","type":"int256"}],"name":"OwnerChangeState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"OwnerWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ScaleFee_State","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_ETH_USD_Price","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Gold_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Oil_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatest_WEI_Silver_Price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

//Get page info based on contract state
function getLatestState() {
contractDefined_JS.methods.ScaleFee_State().call((err, State) => {
  if(State&4) {
    document.getElementById("changeBuyGold").className = "btn btn-outline-danger"
    document.getElementById("getValueWEI_Gold_Price").className = "text-danger"
    document.getElementById("getValueUSD_Gold_Price").className = "text-danger"
    document.getElementById("getValueWEI_Gold_Price").innerHTML = "GOLD"
    document.getElementById("getValueUSD_Gold_Price").innerHTML = "SOLD!"
  }
  else{
    document.getElementById("changeBuyGold").className = "btn btn-outline-warning"
    document.getElementById("getValueWEI_Gold_Price").className = "text-warning"
    document.getElementById("getValueUSD_Gold_Price").className = "text-warning"
    contractDefined_JS.methods.getLatest_WEI_Gold_Price().call((err, balance) => {
      document.getElementById("getValueWEI_Gold_Price").innerHTML =  (balance/(10**18)).toFixed(6) + " ETH"
        contractDefined_JS.methods.getLatest_ETH_USD_Price().call((err, convertToETH_USD) => {
          document.getElementById("getValueUSD_Gold_Price").innerHTML = "$"  + ( (balance*convertToETH_USD)/(10**26) ).toFixed(2) + " USD"
      })
    })
  }
  if(State&2){
    document.getElementById("changeBuySilver").className = "btn btn-outline-danger"
    document.getElementById("getValueWEI_Silver_Price").className = "text-danger"
    document.getElementById("getValueUSD_Silver_Price").className = "text-danger"
    document.getElementById("getValueWEI_Silver_Price").innerHTML = "SILVER"
    document.getElementById("getValueUSD_Silver_Price").innerHTML = "SOLD!"
  }
  else{
    document.getElementById("changeBuySilver").className = "btn btn-outline-secondary"
    document.getElementById("getValueWEI_Silver_Price").className = "text-secondary"
    document.getElementById("getValueUSD_Silver_Price").className = "text-secondary"
    contractDefined_JS.methods.getLatest_WEI_Silver_Price().call((err, balance) => {
      document.getElementById("getValueWEI_Silver_Price").innerHTML = (balance/(10**18)).toFixed(6) + " ETH"
        contractDefined_JS.methods.getLatest_ETH_USD_Price().call((err, convertToETH_USD) => {
        document.getElementById("getValueUSD_Silver_Price").innerHTML = "$"  + ( (balance*convertToETH_USD)/(10**26) ).toFixed(2) + " USD"
      })
    })
  }
  if(State&1){
    document.getElementById("changeBuyOil").className = "btn btn-outline-danger"
    document.getElementById("getValueWEI_Oil_Price").className = "text-danger"
    document.getElementById("getValueUSD_Oil_Price").className = "text-danger"
    document.getElementById("getValueWEI_Oil_Price").innerHTML = "OIL"
    document.getElementById("getValueUSD_Oil_Price").innerHTML = "SOLD!"
  }
  else{
    document.getElementById("changeBuyOil").className = "btn btn-outline-light"
    document.getElementById("getValueWEI_Oil_Price").className = "text-light"
    document.getElementById("getValueUSD_Oil_Price").className = "text-light"
    contractDefined_JS.methods.getLatest_WEI_Oil_Price().call((err, balance) => {
      document.getElementById("getValueWEI_Oil_Price").innerHTML = (balance/(10**18)).toFixed(6) + " ETH"
        contractDefined_JS.methods.getLatest_ETH_USD_Price().call((err, convertToETH_USD) => {
          document.getElementById("getValueUSD_Oil_Price").innerHTML = "$"  + ( (balance*convertToETH_USD)/(10**26) ).toFixed(2) + " USD"
        })
    })
  }

  })
}

////Get the latest value for Scale_Fee and check if we have null values
contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee) => {
  if(ScaleFee === undefined){
    document.getElementById("getValueScale_FeeSmartContract").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getValueScale_FeeSmartContract").className = "text-danger"
    document.getElementById("getValueWEI_Gold_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getValueWEI_Gold_Price").className = "text-danger"
    document.getElementById("getValueWEI_Silver_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getValueWEI_Silver_Price").className = "text-danger"
    document.getElementById("getValueWEI_Oil_Price").innerHTML =  "Install Metamask and select Rinkeby Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getValueWEI_Oil_Price").className = "text-danger"
  }
  else{
    document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + (ScaleFee>>3)/10 + "%"
    getLatestState()
  }
})

//BuyGold button
const changeBuyGold = document.querySelector('#changeBuyGold');
changeBuyGold.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.ScaleFee_State().call((err, State) => {
    if(State&4){
      alert("Gold is sold out! Cannot buy gold until Owner refill.")
    }
    else {
      contractDefined_JS.methods.getLatest_WEI_Gold_Price().call((err, goldPrice) => {
          ethereum
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  //Metamask calculates gas limit and price.
                  from: accounts[0],
                  to: contractAddress_JS,
                  data: contractDefined_JS.methods.BuyGold().encodeABI(),
                  value: web3.utils.toHex(goldPrice)
                  },
              ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
      })
    }
  })

});

//BuySilver button
const changeBuySilver = document.querySelector('#changeBuySilver');
changeBuySilver.addEventListener('click', () => {
  checkAddressMissingMetamask()

  contractDefined_JS.methods.ScaleFee_State().call((err, State) => {
    if(State&2){
      alert("Silver is sold out! Cannot buy silver until Owner refill.")
    }
    else {
        contractDefined_JS.methods.getLatest_WEI_Silver_Price().call((err, silverPrice) => {
          ethereum
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  //Metamask calculates gas limit and price.
                  from: accounts[0],
                  to: contractAddress_JS,
                  data: contractDefined_JS.methods.BuySilver().encodeABI(),
                  value: web3.utils.toHex(silverPrice)
                  },
              ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
        })
    }
  })

});

//BuyOil button
const changeBuyOil = document.querySelector('#changeBuyOil');
changeBuyOil.addEventListener('click', () => {
  checkAddressMissingMetamask()

    contractDefined_JS.methods.ScaleFee_State().call((err, State) => {
      if(State&1){
        alert("Oil is sold out! Cannot buy oil until Owner refill.")
      }
      else {
            contractDefined_JS.methods.getLatest_WEI_Oil_Price().call((err, oilPrice) => {
              ethereum
                .request({
                  method: 'eth_sendTransaction',
                  params: [
                    {
                      //Metamask calculates gas limit and price.
                      from: accounts[0],
                      to: contractAddress_JS,
                      data: contractDefined_JS.methods.BuyOil().encodeABI(),
                      value: web3.utils.toHex(oilPrice)
                      },
                  ],
                })
                .then((txHash) => console.log(txHash))
                .catch((error) => console.error);
            })
      }
    })

});

//Get the latest event. Once the event is triggered, website will update value.
contractDefined_JS.events.ScaleFee_StateChangeEvent({
     fromBlock: 'latest'
 }, function(error, eventResult){})
 .on('data', function(eventResult){
   console.log(eventResult)
     //Get latest Scale_Fee after event.
     contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee) => {
     document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + (ScaleFee>>3)/10 + "%"
     })
     //Check if anything was sold live on the page.
     getLatestState()
   })
 .on('changed', function(eventResult){
     // remove event from local database
 })
 .on('error', console.error);
