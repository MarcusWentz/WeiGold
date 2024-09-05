//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("enableEthereumButton").innerHTML =  "Connect Metamask 🦊"

const optimismSepoliaChainId = 11155420

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
const contractAddress_JS = '0xeC9a237864f7e78fd835Db717DB4e3d3c4254b11'
const contractABI_JS = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"EtherNotSent","type":"error"},{"inputs":[],"name":"MsgValueTooSmall","type":"error"},{"inputs":[],"name":"OraclePriceFeedZero","type":"error"},{"inputs":[],"name":"SlotEmpty","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"SlotsUpdated","type":"event"},{"inputs":[],"name":"MAX_BPS","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SCALE_FEE","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"slot","type":"uint256"}],"name":"buyGold","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getLatestEthUsdPrice","outputs":[{"internalType":"int256","name":"latestEthUsdPrice","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWeiGoldPrice","outputs":[{"internalType":"uint256","name":"latestWeiGoldPrice","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"slot","type":"uint256"},{"internalType":"uint256","name":"count","type":"uint256"}],"name":"ownerUpdateSlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vendingSlotCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

const contractDefined_JS = new ethers.Contract(contractAddress_JS, contractABI_JS, provider);

getDataOnChainToLoad()

async function getDataOnChainToLoad(){
  let chainIdConnected = await getChainIdConnected();

  if(chainIdConnected == optimismSepoliaChainId){
    getContractValues()
  }
  if(chainIdConnected != optimismSepoliaChainId){
    document.getElementById("storageSlotZeroCount").innerHTML =  "Install Metamask and select Optimism Sepolia Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getLatestEthUsdPrice").innerHTML =  "Install Metamask and select Optimism Sepolia Testnet to have a Web3 provider to read blockchain data."
    document.getElementById("getLatestWeiGoldPrice").innerHTML =  "Install Metamask and select Optimism Sepolia Testnet to have a Web3 provider to read blockchain data."
  }

}

async function getChainIdConnected() {
  const connectedNetworkObject = await provider.getNetwork();
  const chainIdConnected = connectedNetworkObject.chainId;
  return chainIdConnected
}

async function getContractValues() {
  let valueGetLatestWeiGoldPrice = await contractDefined_JS.getLatestWeiGoldPrice()
  if(valueGetLatestWeiGoldPrice === undefined){
    document.getElementById("getLatestWeiGoldPrice").innerHTML =  "Install Metamask and select Optimism Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getLatestWeiGoldPrice").innerHTML =   + (valueGetLatestWeiGoldPrice/(10**18)).toFixed(8) + " ETH"
  }
  let valueGetLatestEthUsdPrice = await contractDefined_JS.getLatestEthUsdPrice()
  if(valueGetLatestEthUsdPrice === undefined){
    document.getElementById("getLatestEthUsdPrice").innerHTML =  "Install Metamask and select Optimism Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("getLatestEthUsdPrice").innerHTML =  "$" + (valueGetLatestEthUsdPrice*valueGetLatestWeiGoldPrice/(10**26)).toFixed(2)
  }
  let getVendingSlotCountZero = await contractDefined_JS.vendingSlotCount(0)
  if(getVendingSlotCountZero === undefined){
    document.getElementById("storageSlotZeroCount").innerHTML =  "Install Metamask and select Optimism Sepolia Testnet to have a Web3 provider to read blockchain data."
  }
  else{
    document.getElementById("storageSlotZeroCount").innerHTML = getVendingSlotCountZero
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

  const callDataObject = await contractDefined_JS.populateTransaction.buyGold(0);
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

//BuyGold button
const changeBuyGold = document.querySelector('#changeBuyGold');
changeBuyGold.addEventListener('click', () => {
  checkAddressMissingMetamask()
  buyGoldTx();
});

async function enableMetamaskOnSepolia() {
  //Get account details from Metamask wallet.
  getAccount();

  // Updated chainId request method suggested by Metamask.
  let chainIdConnected = await window.ethereum.request({method: 'net_version'});

  // // Outdated chainId request method which might get deprecated:
  // //  https://github.com/MetaMask/metamask-improvement-proposals/discussions/23
  // let chainIdConnected = window.ethereum.networkVersion;

  //Check if user is on the Sepolia testnet. If not, alert them to change to Sepolia.
  if(chainIdConnected != optimismSepoliaChainId){
    // alert("You are not on the Sepolia Testnet! Please switch to Sepolia and refresh page.")
    try{
      await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{
             chainId: "0xaa37dc"
          }]
        })
      location.reload(); 
      // alert("Failed to add the network at chainId " + sepoliaChainId + " with wallet_addEthereumChain request. Add the network with https://chainlist.org/ or do it manually. Error log: " + error.message)
    } catch (error) {
      alert("Failed to add the network at chainId " + optimismSepoliaChainId + " with wallet_addEthereumChain request. Add the network with https://chainlist.org/ or do it manually. Error log: " + error.message)
    }
  }
}

contractDefined_JS.on("SlotsUpdated", () => {

  getContractValues()

});