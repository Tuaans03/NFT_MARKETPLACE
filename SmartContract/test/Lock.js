const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("NFTmarketplace", function () {
  async function deployOneYearLockFixture() {

    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;
    const address0 = '0x0000000000000000000000000000000000000000' 
    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const Lock = await ethers.getContractFactory("NFTMarketplace");
    const Token = await Lock.deploy(
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      0
    );
    return { Token, unlockTime, lockedAmount, owner, otherAccount,address0};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { Token, owner } = await loadFixture(deployOneYearLockFixture);
      expect(await Token.owner()).to.equal( await owner.address);
    });
  });

  describe("TransferOwnership", function () {
    it("should set the right owwners"),
      async function () {
        const { Token, owner, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );
        await Token.connect(owner).transferOwnership(otherAccount);
        expect(await Token.owner()).to.equal(otherAccount);
      };
  });


});
