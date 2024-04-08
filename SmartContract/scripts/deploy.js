
const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Đây là địa chỉ của owner1
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Đây là địa chỉ của owner2
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Đây là địa chỉ của owner3
    0 // Giá trị thứ tư - bạn cần thay đổi giá trị này nếu cần
  );
  console.log(`deployed contract Address ${nftMarketplace.target}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });