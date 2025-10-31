import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { POLLBOX_ADDRESS, POLLBOX_ABI } from '@/config/contracts';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
});

export interface Poll {
  id: string;
  title: string;
  description: string;
  endDate: string;
  totalVotes: number;
  status: 'active' | 'ended';
}

export async function fetchPollDetails(pollId: number): Promise<Poll | null> {
  try {
    const result = await publicClient.readContract({
      address: POLLBOX_ADDRESS,
      abi: POLLBOX_ABI,
      functionName: 'getPollDetails',
      args: [BigInt(pollId)],
    }) as any;

    const [title, description, creator, deadline, revealed, yesResult, noResult, decryptionPending] = result;
    
    const deadlineNum = Number(deadline);
    const totalVotes = Number(yesResult) + Number(noResult);
    const status = Date.now() / 1000 < deadlineNum && !revealed ? 'active' : 'ended';

    return {
      id: pollId.toString(),
      title,
      description,
      endDate: new Date(deadlineNum * 1000).toLocaleDateString(),
      totalVotes,
      status,
    };
  } catch (error) {
    console.error(`Failed to fetch poll ${pollId}:`, error);
    return null;
  }
}

export async function fetchAllPolls(count: number): Promise<Poll[]> {
  const polls: Poll[] = [];
  
  for (let i = 0; i < count; i++) {
    const poll = await fetchPollDetails(i);
    if (poll) {
      polls.push(poll);
    }
  }
  
  return polls;
}
