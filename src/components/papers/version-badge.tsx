import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

export function VersionBadge({ version }: { version: number }) {
  if (version <= 1) return null;
  return (
    <Badge variant="outline" className="gap-1">
      <History className="h-3 w-3" />
      v{version}
    </Badge>
  );
}