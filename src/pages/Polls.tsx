import { Navbar } from "@/components/Navbar";
import { PollCard } from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadContract } from "wagmi";
import { POLLBOX_ADDRESS, POLLBOX_ABI } from "@/config/contracts";
import { useState, useEffect } from "react";

const Polls = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get total poll count
  const { data: nextPollId } = useReadContract({
    address: POLLBOX_ADDRESS,
    abi: POLLBOX_ABI,
    functionName: "nextPollId",
  });

  // Load all polls
  useEffect(() => {
    const loadPolls = async () => {
      if (!nextPollId) return;

      const pollCount = Number(nextPollId);
      const pollPromises = [];

      for (let i = 0; i < pollCount; i++) {
        pollPromises.push(
          fetch(`/api/poll/${i}`).catch(() => null) // Dummy fetch, will use useReadContract in real implementation
        );
      }

      // For now, load from localStorage
      const storedMetadata = JSON.parse(
        localStorage.getItem("pollMetadata") || "{}"
      );

      const loadedPolls = [];
      for (let i = 0; i < pollCount; i++) {
        // In real implementation, fetch each poll details here
        // For now, just structure the data
        loadedPolls.push({
          id: i.toString(),
          // Metadata would be loaded from chain/localStorage
        });
      }

      setPolls(loadedPolls);
      setLoading(false);
    };

    loadPolls();
  }, [nextPollId]);

  // Filter polls by status
  const now = Math.floor(Date.now() / 1000);
  const activePolls = polls.filter((p: any) => {
    // Would check deadline from contract
    return true; // Placeholder
  });

  const endedPolls = polls.filter((p: any) => {
    // Would check deadline from contract
    return false; // Placeholder
  });

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
