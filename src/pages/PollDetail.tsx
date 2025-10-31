import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Lock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { POLLBOX_ADDRESS, POLLBOX_ABI } from "@/config/contracts";
import { encryptVote } from "@/lib/fhe";

const PollDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { address } = useAccount();
  const pollId = id ? BigInt(id) : BigInt(0);

  // Read poll details from contract
  const { data: pollData, refetch: refetchPoll } = useReadContract({
    address: POLLBOX_ADDRESS,
    abi: POLLBOX_ABI,
    functionName: "getPollDetails",
    args: [pollId],
  });

  // Check if user has voted
  const { data: hasVoted } = useReadContract({
    address: POLLBOX_ADDRESS,
    abi: POLLBOX_ABI,
    functionName: "hasVoted",
    args: [pollId, address || "0x0"],
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [isEncrypting, setIsEncrypting] = useState(false);

  // Handle successful vote submission
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Vote Submitted!",
        description: "Your encrypted vote has been recorded",
      });
      refetchPoll();
    }
  }, [isSuccess, toast, refetchPoll]);

  if (!pollData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-12">
          <p>Loading poll...</p>
        </div>
      </div>
    );
  }

  const [title, description, creator, deadline, revealed, yesResult, noResult, decryptionPending] = pollData;
  const now = Math.floor(Date.now() / 1000);
  const isActive = Number(deadline) > now && !revealed;
  const endDate = new Date(Number(deadline) * 1000).toLocaleDateString();

  const totalVotes = Number(yesResult) + Number(noResult);
  const yesPercentage = totalVotes > 0 ? (Number(yesResult) / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (Number(noResult) / totalVotes) * 100 : 0;

  const handleVote = async (vote: "yes" | "no") => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Set encrypting state immediately
    setIsEncrypting(true);

    try {
      // Show encryption toast
      toast({
        title: "🔐 Encrypting Vote",
        description: `Encrypting your ${vote.toUpperCase()} vote using FHE...`,
      });

      console.log(`[Vote] Encrypting ${vote} vote...`);

      const { encryptedVote, proof } = await encryptVote(
        vote === "yes",
        POLLBOX_ADDRESS,
        address
      );

      // Show submission toast
      toast({
        title: "📝 Submitting Vote",
        description: "Sending encrypted vote to blockchain...",
      });

      console.log("[Vote] Submitting encrypted vote to contract...");

      writeContract({
        address: POLLBOX_ADDRESS,
        abi: POLLBOX_ABI,
        functionName: "vote",
        args: [pollId, encryptedVote, proof],
      });

      setIsEncrypting(false);
    } catch (error: any) {
      setIsEncrypting(false);
      console.error("Failed to vote:", error);
      toast({
        title: "Failed to Vote",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-secondary" : ""}
            >
              {isActive ? "Active Poll" : "Poll Ended"}
            </Badge>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Ends: </span>
                <span className="font-medium">{endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Total Votes: </span>
                <span className="font-medium">{totalVotes}</span>
              </div>
              {isActive && (
                <div className="flex items-center gap-2 text-primary">
                  <Lock className="h-5 w-5" />
                  <span className="font-medium">Votes are encrypted</span>
                </div>
              )}
            </div>

            {isActive && !hasVoted ? (
              <Card className="p-8 bg-gradient-card">
                <h2 className="text-2xl font-bold mb-6 text-center">Cast Your Vote</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="vote-yes"
                    onClick={() => handleVote("yes")}
                    className="h-auto py-8 flex flex-col gap-3"
                    disabled={isEncrypting || isPending || isConfirming}
                  >
                    <CheckCircle className="h-8 w-8" />
                    <span className="text-xl">{isEncrypting || isPending || isConfirming ? "Voting..." : "YES"}</span>
                  </Button>
                  <Button
                    variant="vote-no"
                    onClick={() => handleVote("no")}
                    className="h-auto py-8 flex flex-col gap-3"
                    disabled={isEncrypting || isPending || isConfirming}
                  >
                    <XCircle className="h-8 w-8" />
                    <span className="text-xl">{isEncrypting || isPending || isConfirming ? "Voting..." : "NO"}</span>
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Your vote will be encrypted using FHE technology and cannot be traced back to you
                </p>
              </Card>
            ) : isActive && hasVoted ? (
              <Card className="p-8 bg-gradient-card text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                    <Lock className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Vote Recorded</h3>
                    <p className="text-muted-foreground">
                      Your encrypted vote has been submitted. Results will be revealed after the poll ends.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 bg-gradient-card">
                <h2 className="text-2xl font-bold mb-6">Final Results</h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-vote-yes" />
                        <span className="font-semibold text-lg">YES</span>
                      </div>
                      <span className="text-2xl font-bold text-vote-yes">
                        {yesPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={yesPercentage} className="h-3 bg-muted [&>div]:bg-vote-yes" />
                    <p className="text-sm text-muted-foreground">{Number(yesResult)} votes</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-vote-no" />
                        <span className="font-semibold text-lg">NO</span>
                      </div>
                      <span className="text-2xl font-bold text-vote-no">
                        {noPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={noPercentage} className="h-3 bg-muted [&>div]:bg-vote-no" />
                    <p className="text-sm text-muted-foreground">{Number(noResult)} votes</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;
