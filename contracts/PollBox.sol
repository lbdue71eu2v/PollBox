// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PollBox
 * @notice Binary voting system with encrypted tallies
 * @dev Implements yes/no voting using FHE
 */
contract PollBox is SepoliaConfig {
    struct Poll {
        bytes32 metadataHash;
        address creator;
        uint64 deadline;
        euint128 yesCount;
        euint128 noCount;
        bool revealed;
        uint128 yesResult;
        uint128 noResult;
        bool decryptionPending;
        uint256 pendingRequestId;
    }

    uint256 public nextPollId;
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => uint256) private requestToPoll;
    mapping(uint256 => uint256) private requestTimestamps;

    uint256 public constant MAX_PENDING_DURATION = 10 minutes;

    event PollCreated(uint256 indexed id, address indexed creator, bytes32 metadataHash, uint64 deadline);
    event VoteCast(uint256 indexed id, address indexed voter);
    event RevealRequested(uint256 indexed id, uint256 requestId);
    event Revealed(uint256 indexed id, uint128 yes, uint128 no);
    event RevealCancelled(uint256 indexed id, uint256 requestId);

    error VotingEnded();
    error TooEarly();
    error InvalidDuration();
    error EmptyHash();
    error AlreadyRevealed();
    error AlreadyVoted();
    error DecryptionInProgress();
    error NoPendingReveal();
    error NotCreator();
    error RevealTimeoutNotReached();

    modifier onlyBefore(uint256 id) {
        if (block.timestamp >= polls[id].deadline) revert VotingEnded();
        _;
    }

    modifier onlyAfter(uint256 id) {
        if (block.timestamp < polls[id].deadline) revert TooEarly();
        _;
    }

    /**
     * @notice Create a new poll
     * @param metadataHash IPFS hash pointing to poll metadata
     * @param durationSeconds Poll duration in seconds
     * @return id Poll ID
     */
    function createPoll(bytes32 metadataHash, uint64 durationSeconds) external returns (uint256 id) {
        if (durationSeconds == 0) revert InvalidDuration();
        if (metadataHash == bytes32(0)) revert EmptyHash();
        
        id = nextPollId++;
        Poll storage p = polls[id];
        p.metadataHash = metadataHash;
        p.creator = msg.sender;
        p.deadline = uint64(block.timestamp) + durationSeconds;
        p.yesCount = FHE.asEuint128(0);
        p.noCount = FHE.asEuint128(0);
        
        FHE.allowThis(p.yesCount);
        FHE.allowThis(p.noCount);
        
        emit PollCreated(id, msg.sender, metadataHash, p.deadline);
    }

    /**
     * @notice Cast an encrypted vote
     * @param id Poll ID
     * @param encChoice Encrypted boolean choice (true = yes, false = no)
     * @param inputProof Zero-knowledge proof
     */
    function vote(uint256 id, externalEbool encChoice, bytes calldata inputProof) external onlyBefore(id) {
        Poll storage p = polls[id];
        if (p.revealed || p.decryptionPending) revert DecryptionInProgress();
        if (hasVoted[id][msg.sender]) revert AlreadyVoted();
        
        hasVoted[id][msg.sender] = true;
        ebool choice = FHE.fromExternal(encChoice, inputProof);
        
        euint128 one = FHE.asEuint128(1);
        euint128 zero = FHE.asEuint128(0);
        
        p.yesCount = FHE.add(p.yesCount, FHE.select(choice, one, zero));
        p.noCount = FHE.add(p.noCount, FHE.select(choice, zero, one));
        
        FHE.allowThis(p.yesCount);
        FHE.allowThis(p.noCount);
        
        emit VoteCast(id, msg.sender);
    }

    /**
     * @notice Request reveal after deadline
     * @param id Poll ID
     */
    function requestReveal(uint256 id) external onlyAfter(id) {
        Poll storage p = polls[id];
        if (p.revealed) revert AlreadyRevealed();
        if (p.decryptionPending) revert DecryptionInProgress();
        
        bytes32[] memory handles = new bytes32[](2);
        handles[0] = FHE.toBytes32(p.yesCount);
        handles[1] = FHE.toBytes32(p.noCount);
        
        uint256 reqId = FHE.requestDecryption(handles, this.fulfillReveal.selector);
        requestToPoll[reqId] = id + 1;
        requestTimestamps[reqId] = block.timestamp;
        p.decryptionPending = true;
        p.pendingRequestId = reqId;
        
        emit RevealRequested(id, reqId);
    }

    /**
     * @notice Oracle callback with decrypted results
     * @param requestId Request ID
     * @param decryptedData Decrypted data containing yes and no counts
     * @param decryptionProof Proof from oracle
     */
    function fulfillReveal(
        uint256 requestId,
        bytes memory decryptedData,
        bytes memory decryptionProof
    ) external {
        FHE.checkSignatures(requestId, decryptedData, decryptionProof);

        uint256 stored = requestToPoll[requestId];
        if (stored == 0) revert NoPendingReveal();
        uint256 id = stored - 1;
        Poll storage p = polls[id];
        if (!p.decryptionPending) revert NoPendingReveal();

        // Parse decrypted data (2 uint128 values)
        uint128 yesPlain;
        uint128 noPlain;
        assembly {
            yesPlain := mload(add(decryptedData, 0x20))
            noPlain := mload(add(decryptedData, 0x30))
        }

        p.yesResult = yesPlain;
        p.noResult = noPlain;
        p.revealed = true;
        p.decryptionPending = false;
        p.pendingRequestId = 0;
        delete requestToPoll[requestId];
        delete requestTimestamps[requestId];

        emit Revealed(id, yesPlain, noPlain);
    }

    /**
     * @notice Cancel a pending reveal if the gateway did not respond in time
     * @param id Poll ID
     */
    function cancelReveal(uint256 id) external {
        Poll storage p = polls[id];
        if (!p.decryptionPending) revert NoPendingReveal();
        if (msg.sender != p.creator) revert NotCreator();

        uint256 requestId = p.pendingRequestId;
        uint256 requestedAt = requestTimestamps[requestId];
        if (requestedAt == 0) revert NoPendingReveal();
        if (block.timestamp < requestedAt + MAX_PENDING_DURATION) revert RevealTimeoutNotReached();

        p.decryptionPending = false;
        p.pendingRequestId = 0;
        delete requestToPoll[requestId];
        delete requestTimestamps[requestId];

        emit RevealCancelled(id, requestId);
    }

    /**
     * @notice Get poll details
     */
    function getPollDetails(uint256 id) external view returns (
        bytes32 metadataHash,
        address creator,
        uint64 deadline,
        bool revealed,
        uint128 yesResult,
        uint128 noResult
    ) {
        Poll storage p = polls[id];
        return (p.metadataHash, p.creator, p.deadline, p.revealed, p.yesResult, p.noResult);
    }
}
