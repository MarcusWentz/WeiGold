const { expect } = require("chai");
const { ethers } = require("hardhat");
provider = ethers.provider;

describe("contract WeiGold tests:", function () {

      let WeiGold;
      let WeiGoldDeployed;
      let SelfDestructSendOneEthereum;
      let SelfDestructSendOneEthereumDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {
        WeiGold = await ethers.getContractFactory("WeiGold");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        MockWeiGoldDeployed = await WeiGold.deploy();
        SelfDestructSendOneEthereum = await ethers.getContractFactory("SelfDestructSendOneEthereum");
        SelfDestructSendOneEthereumDeployed = await SelfDestructSendOneEthereum.deploy(MockWeiGoldDeployed.address);
      });

      describe("Constructor", function () {
          it("ScaleFee_State= 0.", async function () {
            expect(await MockWeiGoldDeployed.ScaleFee_State()).to.equal(0);
          });
          it("Owner is equal to default ethers.getSigners() address.", async function () {
              expect(await MockWeiGoldDeployed.Owner()).to.equal(owner.address);
          });
       });

       describe("getLatest_ETH_USD_Price() is 4000 by default.", function () {
          it("See if equal", async function () {
            expect( (await MockWeiGoldDeployed.getLatest_ETH_USD_Price()).toString() ).to.equal('4000');
          });
        });

        describe("getLatest_WEI_Gold_Price() is 400000000000000000 by default.", function () {
          it("See if equal", async function () {
            expect( (await MockWeiGoldDeployed.getLatest_WEI_Gold_Price()).toString() ).to.equal('400000000000000000');
          });
          it("See if value doubles when Scale_fee=1000.", async function () {
            await expect( MockWeiGoldDeployed.OwnerChangeScaleFee(1000))
            expect( (await MockWeiGoldDeployed.getLatest_WEI_Gold_Price()).toString() ).to.equal('800000000000000000');
          });
        });

        describe("getLatest_WEI_Silver_Price() is 5000000000000000 by default.", function () {
          it("See if equal", async function () {
            expect( (await MockWeiGoldDeployed.getLatest_WEI_Silver_Price()).toString() ).to.equal('5000000000000000');
          });
          it("See if value doubles when Scale_fee=1000.", async function () {
            await expect( MockWeiGoldDeployed.OwnerChangeScaleFee(1000))
            expect( (await MockWeiGoldDeployed.getLatest_WEI_Silver_Price()).toString() ).to.equal('10000000000000000');
          });
        });

        describe("getLatest_WEI_Oil_Price() is 20000000000000000 by default.", function () {
          it("See if equal", async function () {
            expect( (await MockWeiGoldDeployed.getLatest_WEI_Oil_Price()).toString() ).to.equal('20000000000000000');
          });
          it("See if value doubles when Scale_fee=1000.", async function () {
            await expect( MockWeiGoldDeployed.OwnerChangeScaleFee(1000))
            expect( (await MockWeiGoldDeployed.getLatest_WEI_Oil_Price()).toString() ).to.equal('40000000000000000');
          });
        });

      describe("BuyGold", function () {
        it("Fail tx if msg.value = 0.", async function () {
        await expect(MockWeiGoldDeployed.BuyGold()).to.be.reverted;
        });
        it("Fail tx if Gold sold already [ScaleFee_State = 4].", async function () {
                // console.log( await MockWeiGoldDeployed.getLatest_WEI_Gold_Price()).toString() ;
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
                // console.log( await MockWeiGoldDeployed.getLatest_WEI_Silver_Price()).toString(10) ;
                await MockWeiGoldDeployed.BuySilver({ value: ethers.utils.parseEther( ('0.005') )  } )
                await expect( MockWeiGoldDeployed.BuySilver({ value: ethers.utils.parseEther( ('0.005') )  } )   ).to.be.revertedWith('Silver is sold out already!');//'With("");
        });
        it("Send correct msg.value and see if event gets state change [ScaleFee_State = 2].", async function () {

                await expect( MockWeiGoldDeployed.BuySilver({ value: ethers.utils.parseEther( ('0.005') )  } )   )
                .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
                .withArgs(owner.address, 2);
        });
      });

      describe("BuyOil", function () {
        it("Fail tx if msg.value = 0.", async function () {
                await expect(MockWeiGoldDeployed.BuyOil()).to.be.reverted;
        });
        it("Fail tx if Oil sold already [ScaleFee_State = 1].", async function () {
                // console.log( await MockWeiGoldDeployed.getLatest_WEI_Oil_Price()).toString() ;
                await MockWeiGoldDeployed.BuyOil({ value: ethers.utils.parseEther( ('0.02') )  } )
                await expect( MockWeiGoldDeployed.BuyOil({ value: ethers.utils.parseEther( ('0.02') )  } )   ).to.be.revertedWith('Oil is sold out already!');//'With("");
        });
        it("Send correct msg.value and see if event gets state change [ScaleFee_State = 1].", async function () {
                await expect( MockWeiGoldDeployed.BuyOil({ value: ethers.utils.parseEther( ('0.02') )  } )   )
                .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
                .withArgs(owner.address, 1);
        });
      });

      describe("OwnerChangeScaleFee", function () {
          it("Fail tx if Owner address is not used for tx.", async function () {
            await expect(MockWeiGoldDeployed.connect(addr2).OwnerChangeScaleFee(7)).to.be.revertedWith('Only contract owner (deployer) can access this function.');
          });
          it("Fail tx if input matches Scale_Fee already.", async function () {
            await expect(MockWeiGoldDeployed.OwnerChangeScaleFee(0)).to.be.revertedWith('Input value is already the same as Scale_Fee!');
          });
          it("Test if updating Scale_Fee = 1000 after State = 7 is 8007.", async function () {
            await MockWeiGoldDeployed.OwnerChangeState(7)
            await expect( MockWeiGoldDeployed.OwnerChangeScaleFee(1000))
            .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
            .withArgs(owner.address, 8007);
          });
      });

      describe("OwnerChangeStateServoAutoWithdraw", function () {
          it("Fail tx if Owner address is not used for tx.", async function () {
            await expect(MockWeiGoldDeployed.connect(addr2).OwnerChangeState(7)).to.be.revertedWith('Only contract owner (deployer) can access this function.');
          });
          it("Fail tx if input matches State already.", async function () {
            await expect(MockWeiGoldDeployed.OwnerChangeState(0)).to.be.revertedWith('Input value is already the same as State!');
          });
          it("Fail tx if input greater than 7.", async function () {
            await expect(MockWeiGoldDeployed.OwnerChangeState(8)).to.be.revertedWith("Input must be less than 8!");
          });
          it("Test if updating State = 7 after Scale_Fee = 1000 is 8007.", async function () {
            await MockWeiGoldDeployed.OwnerChangeScaleFee(1000);
            await expect( MockWeiGoldDeployed.OwnerChangeState(7))
            .to.emit(MockWeiGoldDeployed, "ScaleFee_StateChangeEvent")
            .withArgs(owner.address, 8007);
          });
      });

      describe("OwnerWithdraw", function () {
        it("Fail tx if Owner address is not used for tx.", async function () {
          await expect(MockWeiGoldDeployed.connect(addr2).OwnerClaimSelfDestructedETH()).to.be.revertedWith('Only contract owner (deployer) can access this function.');
        });
        it("Fail tx if contract has no ethereum.", async function () {
          await expect(MockWeiGoldDeployed.OwnerClaimSelfDestructedETH()).to.be.revertedWith('No self destructed ETH detected.');
        });
        it("Self destruct tx sending 1 ETH. 2. Then Withdraw tx. Balance should be 0 after Withdraw.", async function () {
          await SelfDestructSendOneEthereumDeployed.attack({value: ethers.utils.parseEther("1")});
          await MockWeiGoldDeployed.OwnerClaimSelfDestructedETH();
          expect(await provider.getBalance(MockWeiGoldDeployed.address)).to.equal(0);
        });
      });

});
