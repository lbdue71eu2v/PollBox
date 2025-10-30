import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PollCard } from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  // Mock data for featured polls
  const featuredPolls = [
    {
      id: "1",
      title: "Should we implement dark mode?",
      description: "Vote on whether the platform should support dark mode theme for better user experience.",
      endDate: "Dec 31, 2025",
      totalVotes: 1234,
      status: "active" as const,
    },
    {
      id: "2",
      title: "Approve new governance proposal",
      description: "Community vote on the latest governance changes for the protocol.",
      endDate: "Dec 25, 2025",
      totalVotes: 856,
      status: "active" as const,
    },
    {
      id: "3",
      title: "Launch new feature early?",
      description: "Should we release the beta version of the new analytics dashboard ahead of schedule?",
      endDate: "Dec 20, 2025",
      totalVotes: 2143,
      status: "ended" as const,
    },
  ];

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
            {featuredPolls.map((poll) => (
              <PollCard key={poll.id} {...poll} />
            ))}
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
