# PollBox

A privacy-preserving voting platform built with Fully Homomorphic Encryption (FHE) using Zama's fhEVM technology.

## Features

- **Encrypted Voting**: All votes are encrypted using FHE, ensuring complete privacy
- **On-Chain Storage**: Poll data and encrypted votes stored directly on Sepolia blockchain
- **Binary Voting**: Simple YES/NO voting mechanism
- **Delayed Results**: Results only revealed after poll deadline via decryption gateway
- **Web3 Integration**: Connect with MetaMask, OKX Wallet, or other Web3 wallets

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Smart Contracts**: Solidity with Zama fhEVM
- **Blockchain**: Ethereum Sepolia Testnet
- **Web3**: Wagmi v2 + Viem
- **FHE**: Zama Relayer SDK

## Smart Contract

- **Network**: Sepolia Testnet
- **Contract Address**: `0x0D965fF6fDE94999290CcC50D1f44452779c32C4`
- **Explorer**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x0D965fF6fDE94999290CcC50D1f44452779c32C4)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contract Development

```bash
# Install Hardhat dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Sepolia
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" npx hardhat run scripts/deploy.js --network sepolia

# Create test polls
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" npx hardhat run scripts/create-polls.cjs --network sepolia
```

## Environment Variables

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
```

## How It Works

1. **Create Poll**: Users create a poll with title, description, and duration
2. **Cast Vote**: Votes are encrypted client-side using FHE before submission
3. **On-Chain Storage**: Encrypted votes accumulate in smart contract
4. **Request Reveal**: After deadline, anyone can request decryption
5. **Gateway Callback**: Zama gateway decrypts and returns results
6. **Display Results**: Final tallies shown as percentages

## Live Demo

Visit [https://pollbox.vercel.app](https://pollbox.vercel.app) to try the application.

## Security Features

- **Complete Privacy**: Individual votes remain encrypted and untraceable
- **Verifiable Results**: Decryption process is cryptographically verifiable
- **Censorship Resistant**: All data stored on-chain
- **No Middleman**: Direct wallet-to-contract interaction

## License

MIT
