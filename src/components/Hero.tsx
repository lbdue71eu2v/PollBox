import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      <div className="container relative px-4">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Powered by FHE Encryption
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Private Voting,{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Complete Transparency
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            PollBox uses Fully Homomorphic Encryption (FHE) to ensure your vote remains private during the entire voting process. Results are only revealed after the poll closes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/create">Create Your Poll</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/polls">Browse Polls</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card shadow-soft hover:shadow-hover transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Encrypted Votes</h3>
              <p className="text-sm text-muted-foreground text-center">
                All votes are encrypted using FHE technology, ensuring complete privacy during voting
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card shadow-soft hover:shadow-hover transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">Secure Process</h3>
              <p className="text-sm text-muted-foreground text-center">
                Only encrypted vote counts exist during the voting period
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card shadow-soft hover:shadow-hover transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Transparent Results</h3>
              <p className="text-sm text-muted-foreground text-center">
                Results are publicly revealed only after the poll deadline
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
