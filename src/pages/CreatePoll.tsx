import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { POLLBOX_ADDRESS, POLLBOX_ABI } from "@/config/contracts";
import { keccak256, toBytes } from "viem";

const CreatePoll = () => {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { address } = useAccount();

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create metadata object
      const metadata = {
        title,
        description,
        createdAt: Date.now(),
      };

      // Hash metadata to bytes32
      const metadataString = JSON.stringify(metadata);
      const metadataHash = keccak256(toBytes(metadataString));

      // Calculate duration in seconds
      const now = new Date();
      const durationSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

      if (durationSeconds <= 0) {
        toast({
          title: "Invalid Date",
          description: "End date must be in the future",
          variant: "destructive",
        });
        return;
      }

      console.log("Creating poll:", { metadataHash, durationSeconds });

      writeContract({
        address: POLLBOX_ADDRESS,
        abi: POLLBOX_ABI,
        functionName: "createPoll",
        args: [metadataHash, BigInt(durationSeconds)],
      });

      // Store metadata in localStorage for display (in production, use IPFS)
      const existingMetadata = JSON.parse(localStorage.getItem("pollMetadata") || "{}");
      existingMetadata[metadataHash] = metadata;
      localStorage.setItem("pollMetadata", JSON.stringify(existingMetadata));

    } catch (error: any) {
      console.error("Failed to create poll:", error);
      toast({
        title: "Failed to Create Poll",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    toast({
      title: "Poll Created!",
      description: "Your poll has been created successfully with FHE encryption",
    });
    navigate("/polls");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Create New Poll</h1>
            <p className="text-muted-foreground text-lg">
              Create a private Yes/No poll with FHE encryption
            </p>
          </div>

          <Card className="p-6 md:p-8 bg-gradient-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your poll question"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide context and details about your poll"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-foreground">How FHE Encryption Works</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• All votes are encrypted during the voting period</li>
                      <li>• Only encrypted vote totals are stored on-chain</li>
                      <li>• Results are decrypted and revealed after the deadline</li>
                      <li>• Ensures complete voting privacy and integrity</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? "Creating Poll..." : "Create Encrypted Poll"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
