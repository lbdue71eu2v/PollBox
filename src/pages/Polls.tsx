import { Navbar } from "@/components/Navbar";
import { PollCard } from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadContract, useReadContracts } from "wagmi";
import { POLLBOX_ADDRESS, POLLBOX_ABI } from "@/config/contracts";
import { useState, useEffect } from "react";
import { initializePollMetadata } from "@/lib/initPollMetadata";

const Polls = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize metadata on first load
  useEffect(() => {
    if (!localStorage.getItem("pollMetadata")) {
      initializePollMetadata();
    }
  }, []);

  // Get total poll count
  const { data: nextPollId } = useReadContract({
    address: POLLBOX_ADDRESS,
    abi: POLLBOX_ABI,
    functionName: "nextPollId",
  });

  // Load all polls from contract
  useEffect(() => {
    const loadPolls = async () => {
      if (!nextPollId) return;

      const pollCount = Number(nextPollId);
      if (pollCount === 0) {
        setLoading(false);
        return;
      }

      // Load metadata from localStorage
      const storedMetadata = JSON.parse(
        localStorage.getItem("pollMetadata") || "{}"
      );

      const loadedPolls = [];

      // Fetch each poll's details from contract
      for (let i = 0; i < pollCount; i++) {
        try {
          const response = await fetch(
            `https://ethereum-sepolia-rpc.publicnode.com`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: i,
                method: "eth_call",
                params: [
                  {
                    to: POLLBOX_ADDRESS,
                    data: `0xf2d4cf52${i.toString(16).padStart(64, "0")}`, // getPollDetails(uint256)
                  },
                  "latest",
                ],
              }),
            }
          );

          const data = await response.json();
          if (data.result) {
            // Parse the result (simplified)
            const metadataHash = `0x${data.result.slice(2, 66)}`;
            const deadline = parseInt(data.result.slice(130, 146), 16);
            const revealed = parseInt(data.result.slice(146, 148), 16) === 1;
            const yesResult = parseInt(data.result.slice(148, 180), 16);
            const noResult = parseInt(data.result.slice(180, 212), 16);

            const metadata = storedMetadata[metadataHash];
            if (metadata) {
              const totalVotes = yesResult + noResult;
              loadedPolls.push({
                id: i.toString(),
                title: metadata.title,
                description: metadata.description,
                endDate: new Date(deadline * 1000).toLocaleDateString(),
                totalVotes,
                status: Date.now() / 1000 < deadline && !revealed ? "active" : "ended",
              });
            }
          }
        } catch (error) {
          console.error(`Failed to load poll ${i}:`, error);
        }
      }

      setPolls(loadedPolls);
      setLoading(false);
    };

    loadPolls();
  }, [nextPollId]);

  // Filter polls by status
  const activePolls = polls.filter((p: any) => p.status === "active");
  const endedPolls = polls.filter((p: any) => p.status === "ended");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">All Polls</h1>
            <p className="text-muted-foreground text-lg">
              Browse and participate in community polls
            </p>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active">Active Polls</TabsTrigger>
              <TabsTrigger value="ended">Ended Polls</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p>Loading polls...</p>
                ) : activePolls.length > 0 ? (
                  activePolls.map((poll) => <PollCard key={poll.id} {...poll} />)
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No active polls found. Create one to get started!
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ended" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p>Loading polls...</p>
                ) : endedPolls.length > 0 ? (
                  endedPolls.map((poll) => <PollCard key={poll.id} {...poll} />)
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No ended polls found.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Polls;
