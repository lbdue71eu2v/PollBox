import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Vote, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              PollBox
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "transition-colors",
                isActive("/") && "bg-accent"
              )}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "transition-colors",
                isActive("/polls") && "bg-accent"
              )}
            >
              <Link to="/polls">Polls</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "transition-colors",
                isActive("/create") && "bg-accent"
              )}
            >
              <Link to="/create">Create Poll</Link>
            </Button>
          </div>
        </div>

        <ConnectButton />
      </div>
    </nav>
  );
};
