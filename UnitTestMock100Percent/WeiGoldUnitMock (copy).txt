const { expect } = require("chai");
const { ethers } = require("hardhat");
provider = ethers.provider;

describe("contract WeiGold tests:", function () {

      let MockWeiGold;
      let MockWeiGoldDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {

        MockWeiGold = await ethers.getContractFactory('MockWeiGold');
        MockWeiGoldDeployed = await MockWeiGold.deploy();
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        await MockWeiGoldDeployed.deployed();
      });

      describe("Constructor", function () {
          it("ScaleFee_State = 0.", async function () {
            expect( (await MockWeiGoldDeployed.ScaleFee_State()).toString() ).to.equal('0');
          });
       });

      describe("BuyGold", function () {
        it("Fail tx if msg.value = 0.", async function () {
        await expect(MockWeiGoldDeployed.BuyGold()).to.be.reverted;
        });
        it("Fail tx if Gold sold already [ScaleFee_State = 4].", async function () {
                await MockWeiGoldDeployed.BuyGold({ value: ethers.utils.parseEther( ('0.4') )  } )
                await expect( MockWeiGoldDeployed.BuyGold({ value: ethers.utils.parseEther( ('0.4') )  } )   ).to.be.revertedWith('Gold is sold out already!');//'With("");
        });
        it("Send correct msg.value and see if event gets state change [ScaleFee_State = 4].", async function () {

                await expect( MockWeiGoldDeployed.BuyGold({ value: ethers.utils.parseEther( ('0.4') )  } )   )
                .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
                .withArgs(owner.address, 4);
        });
      });

      describe("BuySilver", function () {
        it("Fail tx if msg.value = 0.", async function () {
                await expect(MockWeiGoldDeployed.BuySilver()).to.be.reverted;
        });
        it("Fail tx if Silver sold already [ScaleFee_State = 2].", async function () {
                await MockWeiGoldDeployed.BuySilver({ value: ethers.utils.parseEther( ('0.02') )  } )
                await expect( MockWeiGoldDeployed.BuySilver({ value: ethers.utils.parseEther( ('0.02') )  } )   ).to.be.revertedWith('Silver is sold out already!');//'With("");
        });
        it("Send correct msg.value and see if event gets state change [ScaleFee_State = 2].", async function () {

                await expect( MockWeiGoldDeployed.BuySilver({ value: ethers.utils.parseEther( ('0.02') )  } )   )
                .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
                .withArgs(owner.address, 2);
        });
      });

      describe("BuyOil", function () {
        it("Fail tx if msg.value = 0.", async function () {
                await expect(MockWeiGoldDeployed.BuyOil()).to.be.reverted;
        });
        it("Fail tx if Oil sold already [ScaleFee_State = 1].", async function () {
                await MockWeiGoldDeployed.BuyOil({ value: ethers.utils.parseEther( ('0.005') )  } )
                await expect( MockWeiGoldDeployed.BuyOil({ value: ethers.utils.parseEther( ('0.005') )  } )   ).to.be.revertedWith('Oil is sold out already!');//'With("");
        });
        it("Send correct msg.value and see if event gets state change [ScaleFee_State = 1].", async function () {
                await expect( MockWeiGoldDeployed.BuyOil({ value: ethers.utils.parseEther( ('0.005') )  } )   )
                .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
                .withArgs(owner.address, 1);
        });
      });

});
