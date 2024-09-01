// src/components/NoteContent.tsx
import type React from "react";
import { Badge } from "~/components/ui/badge";
import { Globe, Lock } from "lucide-react";

interface NoteContentProps {
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
}

export const NoteContent: React.FC<NoteContentProps> = ({
  title,
  content,
  isPublic,
  createdAt,
}) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold text-blue-300">{title}</h1>
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
    </div>
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-blue-200">内容:</h3>
      <p className="whitespace-pre-wrap text-gray-300">{content}</p>
    </div>
    <p className="text-sm text-gray-400">
      作成日: {new Date(createdAt).toLocaleString()}
    </p>
  </div>
);
