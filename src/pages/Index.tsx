import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PollCard } from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useReadContract } from "wagmi";
import { POLLBOX_ADDRESS, POLLBOX_ABI } from "@/config/contracts";
import { useState, useEffect } from "react";
import { fetchPollDetails } from "@/lib/pollUtils";

const Index = () => {
  const [featuredPolls, setFeaturedPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get total poll count
  const { data: nextPollId } = useReadContract({
    address: POLLBOX_ADDRESS,
    abi: POLLBOX_ABI,
    functionName: "nextPollId",
  });

  // Load featured polls (first 3 active polls)
  useEffect(() => {
    const loadFeaturedPolls = async () => {
      if (!nextPollId) return;

      const pollCount = Number(nextPollId);
      if (pollCount === 0) {
        setLoading(false);
        return;
      }

      const loadedPolls = [];

      // Fetch up to 3 polls
      for (let i = 0; i < Math.min(pollCount, 3); i++) {
        const poll = await fetchPollDetails(i);
        if (poll) {
          loadedPolls.push(poll);
        }
      }

      setFeaturedPolls(loadedPolls);
      setLoading(false);
    };

    loadFeaturedPolls();
  }, [nextPollId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Featured Polls Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Polls</h2>
              <p className="text-muted-foreground">
                Participate in active community polls
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/polls">
                View All Polls
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full text-center py-8 text-muted-foreground">
                Loading featured polls...
              </p>
            ) : featuredPolls.length > 0 ? (
              featuredPolls.map((poll) => (
                <PollCard key={poll.id} {...poll} />
              ))
            ) : (
              <p className="col-span-full text-center py-8 text-muted-foreground">
                No polls available. Create one to get started!
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Button variant="outline" asChild className="w-full max-w-sm">
              <Link to="/polls">
                View All Polls
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 PollBox. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
