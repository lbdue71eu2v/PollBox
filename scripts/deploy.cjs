const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying PollBox contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

  const PollBox = await hre.ethers.getContractFactory("PollBox");
  const pollBox = await PollBox.deploy();
  await pollBox.deployed();

  console.log("✅ PollBox deployed to:", pollBox.address);
  console.log("\n📝 Update src/config/contracts.ts with this address:");
  console.log(`export const POLLBOX_ADDRESS = getAddress("${pollBox.address}");`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
