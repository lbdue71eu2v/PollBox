const hre = require("hardhat");
const { keccak256, toBytes } = require("viem");

async function main() {
  console.log("🗳️  Creating 4 test polls on PollBox...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const contractAddress = "0x8bF9425f3ef90519dd4B2E03bf74F1cc776A03F5";
  const PollBox = await hre.ethers.getContractAt("PollBox", contractAddress);

  const polls = [
    {
      title: "Should we implement dark mode?",
      description: "Vote on whether the platform should support dark mode theme for better user experience. This would involve redesigning all components to support both light and dark themes."
    },
    {
      title: "Approve new governance proposal",
      description: "Community vote on the latest governance changes for the protocol. This includes updates to voting parameters and treasury management."
    },
    {
      title: "Increase transaction fees?",
      description: "Proposal to adjust network fees to improve infrastructure maintenance and sustainability of the platform."
    },
    {
      title: "Add multi-language support",
      description: "Should we add support for multiple languages including Spanish, French, Chinese, and Japanese to make the platform more accessible globally?"
    }
  ];

  const durationSeconds = 60 * 24 * 60 * 60; // 60 days

  for (let i = 0; i < polls.length; i++) {
    const metadata = {
      title: polls[i].title,
      description: polls[i].description,
      createdAt: Date.now(),
    };

    const metadataString = JSON.stringify(metadata);
    const metadataHash = keccak256(toBytes(metadataString));

    console.log(`\n📝 Creating poll ${i + 1}: "${polls[i].title}"`);
    console.log(`   Metadata hash: ${metadataHash}`);
    console.log(`   Duration: 60 days`);

    const tx = await PollBox.createPoll(metadataHash, durationSeconds);
    const receipt = await tx.wait();

    console.log(`   ✅ Transaction: ${receipt.transactionHash}`);
    console.log(`   📊 Poll ID: ${i}`);

    // Store metadata for frontend
    console.log(`\n   💾 Store this metadata in localStorage:`);
    console.log(`   Key: ${metadataHash}`);
    console.log(`   Value: ${JSON.stringify(metadata)}`);
  }

  console.log("\n\n✅ All 4 polls created successfully!");
  console.log("\n📝 To use in frontend, add these to localStorage:");
  console.log("\nconst pollMetadata = {");

  for (let i = 0; i < polls.length; i++) {
    const metadata = {
      title: polls[i].title,
      description: polls[i].description,
      createdAt: Date.now(),
    };
    const metadataString = JSON.stringify(metadata);
    const metadataHash = keccak256(toBytes(metadataString));
    console.log(`  "${metadataHash}": ${JSON.stringify(metadata)},`);
  }

  console.log("};");
  console.log('\nlocalStorage.setItem("pollMetadata", JSON.stringify(pollMetadata));');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
