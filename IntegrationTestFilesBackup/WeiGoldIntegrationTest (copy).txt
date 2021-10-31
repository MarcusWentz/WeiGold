const { expect } = require('chai');

var chai = require('chai');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

describe('WeiGold Integration Tests', function () {
    before(async function () {
      WeiGoldContract = await ethers.getContractFactory('WeiGold');
      WeiGoldDeployed = await WeiGoldContract.deploy();
      await WeiGoldDeployed.deployed();
    });

    describe("Chainlink Pricefeeds", function () {
      it('Ethereum pricefeed value greater than 0', async function () {
        let resultETH = await WeiGoldDeployed.getLatest_ETH_USD_Price()
        console.log('     ETH [RAW]: ' + new ethers.BigNumber.from(resultETH._hex).toString())
        expect((new ethers.BigNumber.from(resultETH._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from('0').toString())
      });
      it('Gold pricefeed value greater than 0', async function () {
        let resultGold = await WeiGoldDeployed.getLatest_WEI_Gold_Price()
        console.log('     GOLD [SCALED]: ' + new ethers.BigNumber.from(resultGold._hex).toString())
        expect((new ethers.BigNumber.from(resultGold._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from('0').toString())
      });
      it('Silver pricefeed value greater than 0', async function () {
        let resultSilver = await WeiGoldDeployed.getLatest_WEI_Silver_Price()
        console.log('     SILVER [SCALED]: ' + new ethers.BigNumber.from(resultSilver._hex).toString())
        expect((new ethers.BigNumber.from(resultSilver._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from('0').toString())
      });
      it('Oil pricefeed value greater than 0', async function () {
        let resultOil = await WeiGoldDeployed.getLatest_WEI_Oil_Price()
        console.log('     OIL [SCALED]: ' + new ethers.BigNumber.from(resultOil._hex).toString())
        expect((new ethers.BigNumber.from(resultOil._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from('0').toString())
      });
    });

});
