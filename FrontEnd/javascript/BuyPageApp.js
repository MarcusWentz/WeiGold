//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("enableEthereumButton").innerHTML =  "Connect Metamask 🦊"

const sepoliaChainId = 11155111

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

//Function called for getting Metamask accounts on Sepolia. Used in every button in case the user forgets to click the top button.
function enableMetamaskOnSepolia() {
  //Get account details from Metamask wallet.
  getAccount();
  //Check if user is on the Sepolia testnet. If not, alert them to change to Sepolia.
  if(window.ethereum.networkVersion != sepoliaChainId){
    alert("You are not on the Sepolia Testnet! Please switch to Sepolia and refresh page.")
  }
}

//When the page is opened check for error handling issues.
detectMetamaskInstalled()

//Connect to Metamask.
const ethereumButton = document.querySelector('#enableEthereumButton');
ethereumButton.addEventListener('click', () => {
    detectMetamaskInstalled()
    enableMetamaskOnSepolia()
});

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  document.getElementById("enableEthereumButton").innerText = accounts[0].substr(0,5) + "..." +  accounts[0].substr(38,4)
}

//Make Metamask the client side Web3 provider. Needed for tracking live events.
const provider = new ethers.providers.Web3Provider(window.ethereum); //Imported ethers from index.html with "<script src="https://cdn.ethers.io/lib/ethers-5.6.umd.min.js" type="text/javascript"></script>".


//Now build the contract with Web3.
const contractAddress_JS = '0xf72ad88C2DB9e89738773Db2388770572AD3D628'
const contractABI_JS =
[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"etherNotSent","type":"error"},{"inputs":[],"name":"msgValueTooSmall","type":"error"},{"inputs":[],"name":"notOwner","type":"error"},{"inputs":[],"name":"oraclePriceFeedZero","type":"error"},{"inputs":[],"name":"slotEmpty","type":"error"},{"anonymous":false,"inputs":[],"name":"slotsUpdated","type":"event"},{"inputs":[{"internalType":"uint256","name":"slot","type":"uint256"}],"name":"BuyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"slot","type":"uint256"},{"internalType":"uint256","name":"count","type":"uint256"}],"name":"OwnerUpdateSlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getLatestEthUsdPrice","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWeiGoldPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"scaleFee","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vendingSlotCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const contractDefined_JS = new ethers.Contract(contractAddress_JS, contractABI_JS, provider);

getDataOnChainToLoad()

async function getDataOnChainToLoad(){
  let chainIdConnected = await getChainIdConnected();

  if(chainIdConnected == sepoliaChainId){
    callGetLatestWeiGoldPrice()
    callGetLatestEthUsdPrice()
  }
  if(chainIdConnected != sepoliaChainId){
    document.getElementById("getLatestEthUsdPrice").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getLatestWeiGoldPrice").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
  }

}

async function getChainIdConnected() {
  const connectedNetworkObject = await provider.getNetwork();
  const chainIdConnected = connectedNetworkObject.chainId;
  return chainIdConnected
}

async function callGetLatestWeiGoldPrice() {
  let storedDataCallValue = await contractDefined_JS.getLatestWeiGoldPrice()
  if(storedDataCallValue === undefined){
    document.getElementById("getLatestWeiGoldPrice").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getLatestWeiGoldPrice").innerHTML =  storedDataCallValue + " ETH"
  }
}

async function callGetLatestEthUsdPrice() {
  let storedDataCallValue = await contractDefined_JS.getLatestEthUsdPrice()
  if(storedDataCallValue === undefined){
    document.getElementById("getLatestEthUsdPrice").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getLatestEthUsdPrice").innerHTML =  "$" + storedDataCallValue 
  }
}

async function buyGoldTx() {

  const storageCount = await contractDefined_JS.vendingSlotCount(0);
  if(storageCount == 0){
    alert("Gold is sold out! Cannot buy gold until Owner refill.")
    return;
  }

  const ethGoldPrice = await contractDefined_JS.getLatestWeiGoldPrice();
  if(ethGoldPrice == 0){
    alert("Oracle price from getLatestWeiGoldPrice() is zero.")
    return;
  }

  const callDataObject = await contractDefined_JS.populateTransaction.BuyGold(0);
  const txData = callDataObject.data;
  

  const mempoolScaleTenPercent = BigInt(ethGoldPrice)*BigInt(110)/BigInt(100)

  // console.log(ethGoldPrice)
  // console.log(mempoolScaleTenPercent)

  ethereum
  .request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: accounts[0],
        to: contractAddress_JS,
        data: txData,
        value: ethers.utils.hexlify(mempoolScaleTenPercent)
      },
    ],
  })
  .then((txHash) => console.log(txHash))
  .catch((error) => console.error);  
    
}


//Get page info based on contract state
// function getLatestState() {
// contractDefined_JS.methods.ScaleFee_State().call((err, State) => {
//   if(State&4) {
//     document.getElementById("changeBuyGold").className = "btn btn-outline-danger"
//     document.getElementById("getValueUSD_Gold_Price").className = "text-danger"
//     document.getElementById("getValueUSD_Gold_Price").innerHTML = "GOLD SOLD!"
//   }
//   else{
//     document.getElementById("changeBuyGold").className = "btn btn-outline-warning"
//     document.getElementById("getValueUSD_Gold_Price").className = "text-warning"
//     contractDefined_JS.methods.getLatest_WEI_Gold_Price().call((err, WEI_Gold_Price) => {
//         contractDefined_JS.methods.getLatest_ETH_USD_Price().call((err, convertToETH_USD) => {
//           document.getElementById("getValueUSD_Gold_Price").innerHTML = (WEI_Gold_Price/(10**18)).toFixed(6) + " ETH = $"  + ( (WEI_Gold_Price*convertToETH_USD)/(10**26) ).toFixed(2) + " USD"
//       })
//     })
//   }
//   if(State&2){
//     document.getElementById("changeBuySilver").className = "btn btn-outline-danger"
//     document.getElementById("getValueUSD_Silver_Price").className = "text-danger"
//     document.getElementById("getValueUSD_Silver_Price").innerHTML = "SILVER SOLD!"
//   }
//   else{
//     document.getElementById("changeBuySilver").className = "btn btn-outline-secondary"
//     document.getElementById("getValueUSD_Silver_Price").className = "text-secondary"
//     contractDefined_JS.methods.getLatest_WEI_Silver_Price().call((err, WEI_Silver_Price) => {
//         contractDefined_JS.methods.getLatest_ETH_USD_Price().call((err, convertToETH_USD) => {
//         document.getElementById("getValueUSD_Silver_Price").innerHTML =  (WEI_Silver_Price/(10**18)).toFixed(6) + " ETH = $"  + ( (WEI_Silver_Price*convertToETH_USD)/(10**26) ).toFixed(2) + " USD"
//       })
//     })
//   }
//   if(State&1){
//     document.getElementById("changeBuyOil").className = "btn btn-outline-danger"
//     document.getElementById("getValueUSD_Oil_Price").className = "text-danger"
//     document.getElementById("getValueUSD_Oil_Price").innerHTML = "OIL SOLD!"
//   }
//   else{
//     document.getElementById("changeBuyOil").className = "btn btn-outline-light"
//     document.getElementById("getValueUSD_Oil_Price").className = "text-light"
//     contractDefined_JS.methods.getLatest_WEI_Oil_Price().call((err, WEI_Oil_Price) => {
//         contractDefined_JS.methods.getLatest_ETH_USD_Price().call((err, convertToETH_USD) => {
//           document.getElementById("getValueUSD_Oil_Price").innerHTML = (WEI_Oil_Price/(10**18)).toFixed(6) + " ETH = $"  + ( (WEI_Oil_Price*convertToETH_USD)/(10**26) ).toFixed(2) + " USD"
//         })
//     })
//   }

//   })
// }

// ////Get the latest value for Scale_Fee and check if we have null values
// contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee) => {
//   if(ScaleFee === undefined){
//     document.getElementById("getValueScale_FeeSmartContract").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
//     document.getElementById("getValueScale_FeeSmartContract").className = "text-danger"
//     document.getElementById("getValueUSD_Gold_Price").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
//     document.getElementById("getValueUSD_Gold_Price").className = "text-danger"
//     document.getElementById("getValueUSD_Silver_Price").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
//     document.getElementById("getValueUSD_Silver_Price").className = "text-danger"
//     document.getElementById("getValueUSD_Oil_Price").innerHTML =  "Install Metamask and select Sepolia Testnet to have a Web3 provider to read blockchain data."
//     document.getElementById("getValueUSD_Oil_Price").className = "text-danger"
//   }
//   else{
//     document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + (ScaleFee>>3)/10 + "%"
//     getLatestState()
//   }
// })

//BuyGold button
const changeBuyGold = document.querySelector('#changeBuyGold');
changeBuyGold.addEventListener('click', () => {
  checkAddressMissingMetamask()
  buyGoldTx();

  // // contractDefined_JS.methods.vendingSlotCount(0).call((err, State) => {
  // //   if(State&4){
  // //     alert("Gold is sold out! Cannot buy gold until Owner refill.")
  // //   }
  // //   else {
  //     contractDefined_JS.methods.getLatest_WEI_Gold_Price().call((err, goldPrice) => {
  //         ethereum
  //           .request({
  //             method: 'eth_sendTransaction',
  //             params: [
  //               {
  //                 //Metamask calculates gas limit and price.
  //                 from: accounts[0],
  //                 to: contractAddress_JS,
  //                 data: contractDefined_JS.methods.BuyGold(0).encodeABI(),
  //                 value: ethers.utils.toHex(goldPrice)
  //                 },
  //             ],
  //           })
  //           .then((txHash) => console.log(txHash))
  //           .catch((error) => console.error);
  //     })
  //   }
  // // })

});

// //Get the latest event. Once the event is triggered, website will update value.
// contractDefined_JS.events.slotsUpdated({
//      fromBlock: 'latest'
//  }, function(error, eventResult){})
//  .on('data', function(eventResult){
//    console.log(eventResult)
//      //Get latest Scale_Fee after event.
//     //  contractDefined_JS.methods.ScaleFee_State().call((err, ScaleFee) => {
//     //  document.getElementById("getValueScale_FeeSmartContract").innerHTML = "Scale_Fee = " + (ScaleFee>>3)/10 + "%"
//     //  })
//      //Check if anything was sold live on the page.
//      getLatestState()
//    })
//  .on('changed', function(eventResult){
//      // remove event from local database
//  })
//  .on('error', console.error);

contractDefined_JS.on("slotsUpdated", () => {

  // getStoredData()

});
