import { getAddress } from "viem";

// PollBox contract address (Sepolia)
export const POLLBOX_ADDRESS = getAddress("0x0D965fF6fDE94999290CcC50D1f44452779c32C4");

// PollBox ABI (extracted from contracts/PollBox.sol)
export const POLLBOX_ABI = [
  {
    type: "function",
    name: "createPoll",
    inputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "durationSeconds", type: "uint64" }
    ],
    outputs: [{ name: "id", type: "uint256" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "vote",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "encChoice", type: "bytes32" },
      { name: "inputProof", type: "bytes" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "requestReveal",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "cancelReveal",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getPollDetails",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "creator", type: "address" },
      { name: "deadline", type: "uint64" },
      { name: "revealed", type: "bool" },
      { name: "yesResult", type: "uint128" },
      { name: "noResult", type: "uint128" },
      { name: "decryptionPending", type: "bool" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "hasVoted",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "nextPollId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "polls",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "creator", type: "address" },
      { name: "deadline", type: "uint64" },
      { name: "yesCount", type: "bytes32" },
      { name: "noCount", type: "bytes32" },
      { name: "revealed", type: "bool" },
      { name: "yesResult", type: "uint128" },
      { name: "noResult", type: "uint128" },
      { name: "decryptionPending", type: "bool" },
      { name: "pendingRequestId", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "PollCreated",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "title", type: "string", indexed: false },
      { name: "deadline", type: "uint64", indexed: false }
    ]
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "voter", type: "address", indexed: true }
    ]
  },
  {
    type: "event",
    name: "RevealRequested",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "requestId", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "Revealed",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "yes", type: "uint128", indexed: false },
      { name: "no", type: "uint128", indexed: false }
    ]
  },
  {
    type: "event",
    name: "RevealCancelled",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "requestId", type: "uint256", indexed: false }
    ]
  },
  {
    type: "error",
    name: "VotingEnded"
  },
  {
    type: "error",
    name: "TooEarly"
  },
  {
    type: "error",
    name: "InvalidDuration"
  },
  {
    type: "error",
    name: "EmptyTitle"
  },
  {
    type: "error",
    name: "AlreadyRevealed"
  },
  {
    type: "error",
    name: "AlreadyVoted"
  },
  {
    type: "error",
    name: "DecryptionInProgress"
  },
  {
    type: "error",
    name: "NoPendingReveal"
  },
  {
    type: "error",
    name: "NotCreator"
  },
  {
    type: "error",
    name: "RevealTimeoutNotReached"
  }
] as const;
