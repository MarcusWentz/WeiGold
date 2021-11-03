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
        WeiGoldDeployed = await WeiGold.deploy();
        SelfDestructSendOneEthereum = await ethers.getContractFactory("SelfDestructSendOneEthereum");
        SelfDestructSendOneEthereumDeployed = await SelfDestructSendOneEthereum.deploy(WeiGoldDeployed.address);
      });

      describe("Constructor", function () {
          it("ScaleFee_State= 0.", async function () {
            expect(await WeiGoldDeployed.ScaleFee_State()).to.equal(0);
          });
          it("Owner is equal to default ethers.getSigners() address.", async function () {
              expect(await WeiGoldDeployed.Owner()).to.equal(owner.address);
          });
       });

      describe("OwnerChangeScaleFee", function () {
          it("Fail tx if Owner address is not used for tx.", async function () {
            await expect(WeiGoldDeployed.connect(addr2).OwnerChangeScaleFee(7)).to.be.revertedWith('Only contract owner (deployer) can access this function.');
          });
          it("Fail tx if input matches Scale_Fee already.", async function () {
            await expect(WeiGoldDeployed.OwnerChangeScaleFee(0)).to.be.revertedWith('Input value is already the same as Scale_Fee!');
          });
          it("Test if updating Scale_Fee = 1000 after State = 7 is 8007.", async function () {
            await WeiGoldDeployed.OwnerChangeState(7)
            await expect( WeiGoldDeployed.OwnerChangeScaleFee(1000))
            .to.emit(WeiGoldDeployed, "ScaleFee_StateChangeEvent")
            .withArgs(owner.address, 8007);
          });
      });

      describe("OwnerChangeStateServoAutoWithdraw", function () {
          it("Fail tx if Owner address is not used for tx.", async function () {
            await expect(WeiGoldDeployed.connect(addr2).OwnerChangeState(7)).to.be.revertedWith('Only contract owner (deployer) can access this function.');
          });
          it("Fail tx if input matches State already.", async function () {
            await expect(WeiGoldDeployed.OwnerChangeState(0)).to.be.revertedWith('Input value is already the same as State!');
          });
          it("Fail tx if input greater than 7.", async function () {
            await expect(WeiGoldDeployed.OwnerChangeState(8)).to.be.revertedWith("Input must be less than 8!");
          });
          it("Test if updating State = 7 after Scale_Fee = 1000 is 8007.", async function () {
            await WeiGoldDeployed.OwnerChangeScaleFee(1000);
            await expect( WeiGoldDeployed.OwnerChangeState(7))
            .to.emit(WeiGoldDeployed, "ScaleFee_StateChangeEvent")
            .withArgs(owner.address, 8007);
          });
      });

      describe("OwnerWithdraw", function () {
        it("Fail tx if Owner address is not used for tx.", async function () {
          await expect(WeiGoldDeployed.connect(addr2).OwnerWithdraw()).to.be.revertedWith('Only contract owner (deployer) can access this function.');
        });
        it("Fail tx if contract has no ethereum.", async function () {
          await expect(WeiGoldDeployed.OwnerWithdraw()).to.be.revertedWith('No funds to withdraw from contract!');
        });
        it("Self destruct tx sending 1 ETH. 2. Then Withdraw tx. Balance should be 0 after Withdraw.", async function () {
          await SelfDestructSendOneEthereumDeployed.attack({value: ethers.utils.parseEther("1")});
          await WeiGoldDeployed.OwnerWithdraw();
          expect(await provider.getBalance(WeiGoldDeployed.address)).to.equal(0);
        });
      });

      describe("BuyGold", function () {
          it("Fail tx if msg.value != getLatest_WEI_Gold_Price() [msg.value = 0].", async function () {
            await expect(WeiGoldDeployed.BuyGold()).to.be.reverted;
          });
      });

      describe("BuySilver", function () {
        it("Fail tx if msg.value != getLatest_WEI_Silver_Price() [msg.value = 0].", async function () {
          await expect(WeiGoldDeployed.BuySilver()).to.be.reverted;
        });
      });

       describe("BuyOil", function () {
         it("Fail tx if msg.value != getLatest_WEI_Oil_Price() [msg.value = 0].", async function () {
           await expect(WeiGoldDeployed.BuyOil()).to.be.reverted;
         });
        });

});

