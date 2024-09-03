import { Globe, Lock } from "lucide-react";
import type React from "react";
import { Badge } from "~/components/ui/badge";

interface PublicBadgeProps {
  isPublic: boolean;
}

export const PublicBadge: React.FC<PublicBadgeProps> = ({ isPublic }) => (
  <Badge variant={isPublic ? "default" : "secondary"} className="ml-2">
    {isPublic ? (
      <>
        <Globe className="w-3 h-3 mr-1" />
        公開
      </>
    ) : (
      <>
        <Lock className="w-3 h-3 mr-1" />
        非公開
      </>
    )}
  </Badge>
);
