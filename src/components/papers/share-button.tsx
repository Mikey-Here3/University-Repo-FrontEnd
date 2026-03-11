"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  paperId: string;
  title: string;
}

export function ShareButton({ paperId, title }: Props) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/papers/${paperId}` : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, "_blank");
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this paper: ${url}`)}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={copyLink}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareWhatsApp}>
          💬 WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareEmail}>
          ✉️ Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}