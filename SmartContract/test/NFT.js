const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace",function(){
    
    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;
        const address0 = '0x0000000000000000000000000000000000000000' 
        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();    
        const Lock = await ethers.getContractFactory("NFTMarketplace");
        const Token = await Lock.deploy("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512","0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512","0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",0);
    
        return { Token, unlockTime, lockedAmount, owner, otherAccount,address0 };
    }

    describe("Deployment", function () {
  
        it("Should set the right owner", async function () {
          const { lock, owner } = await loadFixture(deployOneYearLockFixture);
          expect(await lock.owner()).to.equal(owner.address);
        });
    });

    
  
    describe("ListForSale",function(){
        it("should set the right data"), async function(){
            const {Token,address0} = await loadFixture(deployOneYearLockFixture);
            await Token.connect(address0).listForSale(1,1,1);
            expect (await Token.balanceOf(address0).to.equal(1));
        }
    })

})