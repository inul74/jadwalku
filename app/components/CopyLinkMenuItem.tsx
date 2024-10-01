"use client";

import { toast } from "sonner";
import { Link2 } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface CopyLinkMenuItemProps {
  meetingUrl: string;
}

export function CopyLinkMenuItem({ meetingUrl }: CopyLinkMenuItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("URL copied to clipboard");
    } catch (err) {
      console.error("Could not copy text: ", err);
      toast.error("Failed to copy URL");
    }
  };

  return (
    <DropdownMenuItem onSelect={handleCopy}>
      <Link2 className="mr-2 h-4 w-4" />
      <span>Copy</span>
    </DropdownMenuItem>
  );
}
