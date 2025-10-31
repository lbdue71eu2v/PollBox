const hre = require("hardhat");

async function main() {
  console.log("🗳️  Creating test polls on PollBox...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const contractAddress = "0x0D965fF6fDE94999290CcC50D1f44452779c32C4";
  const PollBox = await hre.ethers.getContractAt("PollBox", contractAddress);

  const polls = [
    {
      title: "Should we implement dark mode?",
      description: "Vote on whether the platform should support dark mode theme for better user experience. This would involve redesigning all components to support both light and dark themes.",
      duration: 30 * 24 * 60 * 60 // 30 days
    },
    {
      title: "Approve new governance proposal",
      description: "Community vote on the latest governance changes for the protocol. This includes updates to voting parameters and treasury management.",
      duration: 25 * 24 * 60 * 60 // 25 days
    },
    {
      title: "Increase transaction fees?",
      description: "Proposal to adjust network fees to improve infrastructure maintenance and sustainability of the platform.",
      duration: 20 * 24 * 60 * 60 // 20 days
    },
    {
      title: "Add multi-language support",
      description: "Should we add support for multiple languages including Spanish, French, Chinese, and Japanese to make the platform more accessible globally?",
      duration: 15 * 24 * 60 * 60 // 15 days
    },
    {
      title: "Launch new analytics dashboard?",
      description: "Should we release the beta version of the new analytics dashboard with advanced metrics and real-time data visualization?",
      duration: 10 * 24 * 60 * 60 // 10 days
    }
  ];

  for (let i = 0; i < polls.length; i++) {
    console.log(`\n📝 Creating poll ${i + 1}: "${polls[i].title}"`);
    console.log(`   Duration: ${polls[i].duration / (24 * 60 * 60)} days`);

    try {
      const tx = await PollBox.createPoll(
        polls[i].title,
        polls[i].description,
        polls[i].duration
      );
      const receipt = await tx.wait();

      console.log(`   ✅ Transaction: ${receipt.transactionHash}`);
      console.log(`   📊 Poll ID: ${i}`);
    } catch (error) {
      console.error(`   ❌ Failed to create poll: ${error.message}`);
    }
  }

  console.log("\n\n✅ All polls created successfully!");
  console.log("\n🔗 View on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
