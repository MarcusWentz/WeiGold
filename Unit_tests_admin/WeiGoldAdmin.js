const { expect } = require("chai");
const { ethers } = require("hardhat");
provider = ethers.provider;

describe("contract WeiGold tests:", function () {

      let WeiGold;
      let WeiGoldDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {
        WeiGold = await ethers.getContractFactory("WeiGold");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        WeiGoldDeployed = await WeiGold.deploy();
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
          it("Check OwnerChangeScaleFee input changed Scale_Fee with event: Input 10: (1000>>3) = 8000.", async function () {
            //const valueWait= await WeiGoldDeployed.OwnerChangeScaleFee(1000);
            //valueWait.wait();
            await expect( WeiGoldDeployed.OwnerChangeScaleFee(1000))
            .to.emit(WeiGoldDeployed, "ScaleFee_StateChangeEvent")
            .withArgs(owner.address, 8000);
          });
      });

      //NOTE DONE DO THE WITHDRAW PART CHECK TRANSFER
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
          it("Check OwnerChangeStateServoAutoWithdraw input changed State value.", async function () {
            //await WeiGoldDeployed.OwnerChangeScaleFee(1000);
            //.wait();
            await expect( WeiGoldDeployed.OwnerChangeState(7))
            .to.emit(WeiGoldDeployed, "ScaleFee_StateChangeEvent")
            .withArgs(owner.address, 7);
          });
      });

      describe("OwnerWithdraw", function () {
        it("Fail tx if Owner address is not used for tx.", async function () {
          await expect(WeiGoldDeployed.connect(addr2).OwnerWithdraw()).to.be.revertedWith('Only contract owner (deployer) can access this function.');
        });
        it("Fail tx if contract has no ethereum.", async function () {
          await expect(WeiGoldDeployed.OwnerWithdraw()).to.be.revertedWith('No funds to withdraw from contract!');
        });
        // it("Contract balance should be 0 after this function is executed.", async function () {
        //   expect(await provider.getBalance(WeiGoldDeployed.address)).to.equal(0);
        // });
      });

      //
      // //INTEGRATION TESTS NEED TO USE CHAINLINK COMMAND LINES SAVE FOR LATER
      // // // "npx hardhat read-price-feed --contract insert-contract-address-here --network network"
      describe("BuyGold", function () {
          // it("Fail tx if (State&4) == 4.", async function () {
          //   //console.log(await WeiGoldDeployed.getLatest_WEI_Gold_Price() )
          //   //
          //   //expect(await WeiGoldDeployed.State()    WeiGoldDeployed.connect(addr2) .); ///////////
          //
          //   const setBuyGoldTx = await WeiGoldDeployed.BuyGold();
          //   await setBuyGoldTx.wait();
          //   expect(await WeiGoldDeployed.State()).to.equal(8);
          //   //expect(await WeiGoldDeployed.Scale_Fee()).to.equal(0);
          // });
          // it("Fail tx if getLatest_WEI_Gold_Price == 0.", async function () {
          //   //console.log(await WeiGoldDeployed.getLatest_WEI_Gold_Price() )
          //   //
          //   //expect(await WeiGoldDeployed.State()    WeiGoldDeployed.connect(addr2) .); ///////////
          //
          //   const setBuyGoldTx = await WeiGoldDeployed.BuyGold();
          //   await setBuyGoldTx.wait();
          //   expect(await WeiGoldDeployed.State()).to.equal(8);
          //   //expect(await WeiGoldDeployed.Scale_Fee()).to.equal(0);
          // });
          it("Fail tx if msg.value != getLatest_WEI_Gold_Price() [msg.value = 0].", async function () {
            //console.log(await WeiGoldDeployed.getLatest_WEI_Gold_Price() )
            //
            //expect(await WeiGoldDeployed.State()    WeiGoldDeployed.connect(addr2) .); ///////////

            await expect(WeiGoldDeployed.BuyGold()).to.be.reverted;
            //expect(await WeiGoldDeployed.BuyGold(value: ethers.utils.parseEther("0") } ) ).to.be.reverted();
            // const setBuyGoldTx = await WeiGoldDeployed.BuyGold();
            // await setBuyGoldTx.wait();
            // expect(await WeiGoldDeployed.State()).to.equal(8);
            //expect(await WeiGoldDeployed.Scale_Fee()).to.equal(0);
          });
          // it("Fail tx if msg.value != getLatest_WEI_Gold_Price.", async function () {
          //   //console.log(await WeiGoldDeployed.getLatest_WEI_Gold_Price() )
          //   //
          //   //expect(await WeiGoldDeployed.State()    WeiGoldDeployed.connect(addr2) .); ///////////
          //   const setBuyGoldTx = await WeiGoldDeployed.BuyGold();
          //   await setBuyGoldTx.wait();
          //   //await expect(WeiGoldDeployed.OwnerChangeStateServoAutoWithdraw()).to.be.reverted;
          //   expect(await WeiGoldDeployed.State()).to.equal(8);
          //   //expect(await WeiGoldDeployed.Scale_Fee()).to.equal(0);
          // });
          // it("State is updated to State += 4.", async function () {
          //   //console.log(await WeiGoldDeployed.getLatest_WEI_Gold_Price() )
          //   //
          //   //expect(await WeiGoldDeployed.State()    WeiGoldDeployed.connect(addr2) .); ///////////
          //   const stateBeforeBuyingGold = (await WeiGoldDeployed.State() ) ;
          //   console.log("STATE BEFORE BUYING GOLD: " + stateBeforeBuyingGold)
          //
          //   ////await contract.connect(addr1).placeBet(game.id, 2, { value: ethers.utils.parseEther("0.5") });
          //   const BuyingGoldPrice = (await WeiGoldDeployed.State() ) ;
          //   console.log("GOLD PRICE: " + BuyingGoldPrice);
          //
          //   //
          //   const setBuyGoldTx = await WeiGoldDeployed.getLatest_WEI_Gold_Price();
          //   await setBuyGoldTx.wait();
          //
          //   const stateAfterBuyingGold = (await WeiGoldDeployed.State() ) ;
          //   //SEND TRASCATION WITH MSG.VALUE TO MAKE IT WORK
          //
          //   console.log("STATE AFTER BUYING GOLD: " + stateAfterBuyingGold )
          //   await expect(await WeiGoldDeployed.State().to.equal(stateBeforeBuyingGold+=4) );
          //   //expect(await WeiGoldDeployed.Scale_Fee()).to.equal(0);
          // });
          // it("Event check if State+=4.", async function () {
          //     expect(await WeiGoldDeployed.State()).to.equal(8);
          // });
      });

      describe("BuySilver", function () {
        it("Fail tx if msg.value != getLatest_WEI_Silver_Price() [msg.value = 0].", async function () {
          await expect(WeiGoldDeployed.BuySilver()).to.be.reverted;
        });
      ////
      ///
      });

       describe("BuyOil", function () {
         it("Fail tx if msg.value != getLatest_WEI_Oil_Price() [msg.value = 0].", async function () {
           await expect(WeiGoldDeployed.BuyOil()).to.be.reverted;
         });
         /////
         /////
        });

});

//DEBUG RESOURCES:

          // it("DEBUG EVENT TESTING CUT", async function () {
          //
          //     //await expect(eventEmitter.emitMyEventWithData(42, "foo")).to.emit(eventEmitter, "MyEventWithData").withArgs(42, "foo");
          //     //https://ethereum.stackexchange.com/questions/110004/testing-for-emitted-events-in-hardhat
          //
          //
          //     // const setScale_FeeTx = await WeiGoldDeployed.OwnerChangeScaleFee(10);
          //     // const receipt = await setScale_FeeTx.wait();
          //
          //
          //
          //     // // https://docs.ethers.io/v5/api/providers/provider/
          //     // const CurrentBlock = await provider.getBlockNumber();
          //     // console.log("Block = " + CurrentBlock);
          //     //
          //     // //https://dmitripavlutin.com/access-object-properties-javascript/
          //     // const BlockContentsHash = await provider.getBlock(CurrentBlock);
          //     // console.log("CurrentDate: " + CurrentDate.hash )
          //
          //     expect(await WeiGoldDeployed.Scale_Fee()).to.equal(0);
          //
          //               //
          //               // await expect(eventEmitter.emitMyEventWithData(42, "foo"))
          //               //   .to.emit(eventEmitter, "MyEventWithData")
          //               //   .withArgs(42, "foo", owner.address);
          //     //
          //     // await expect( WeiGoldDeployed.contractStateChangeEvent()  )
          //     // .to.emit(WeiGoldDeployed, "contractStateChangeEvent")
          //     // .withArgs(owner.address, CurrentState, CurrentScale_Fee);
          //
          //
          // });
          //
          // //Get balances. DO THIS CHECK AFTER TX GOES THROUGH!
          // const ContractBalanceBeforeTransfer = await provider.getBalance(WeiGoldDeployed.address) ;
          // const OwnerBalanceBeforeTransferconsole = await provider.getBalance(owner.address);
          // //Balances update with ETH sent from contract to owner. Express logic check (addition to owner address?)
          //
          // //How to format checks https://github.com/ethers-io/ethers.js/issues/1310
          // console.log(await (provider.getBalance(WeiGoldDeployed.address)  ) );
          // //console.log(await (provider.getBalance(WeiGoldDeployed.address)).toString() );
          // //console.log(await ethers.utils.formatEther(provider.getBalance(WeiGoldDeployed.address) ) );
          // console.log(await provider.getBalance(owner.address));
          // //TEST SHOULD BE DONE WHEN CONTRACT HAS FUNDS.
          //
          // //expect(await provider.getBalance(WeiGoldDeployed.address).to.equal(0);
