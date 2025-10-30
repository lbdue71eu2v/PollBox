import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Users, Lock } from "lucide-react";

interface PollCardProps {
  id: string;
  title: string;
  description: string;
  endDate: string;
  totalVotes: number;
  status: "active" | "ended";
}

export const PollCard = ({
  id,
  title,
  description,
  endDate,
  totalVotes,
  status,
}: PollCardProps) => {
  return (
    <Card className="p-6 hover:shadow-hover transition-all duration-300 bg-gradient-card">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={status === "active" ? "bg-secondary" : ""}
          >
            {status === "active" ? "Active" : "Ended"}
          </Badge>
        </div>

        <p className="text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{endDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
          {status === "active" && (
            <div className="flex items-center gap-1 text-primary">
              <Lock className="h-4 w-4" />
              <span>Encrypted</span>
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link to={`/poll/${id}`}>
            {status === "active" ? "Vote Now" : "View Results"}
          </Link>
        </Button>
      </div>
    </Card>
  );
};
