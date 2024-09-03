// src/components/NoteContent.tsx
import type React from "react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PublicBadge } from "../PublicBadge";

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
    <div className="flex flex-row-reverse">
      <PublicBadge isPublic={isPublic} />
    </div>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <p className="whitespace-pre-wrap text-gray-300">{content}</p>
      </div>
      <p className="text-sm text-gray-400">
        作成日: {new Date(createdAt).toLocaleString()}
      </p>
    </CardContent>
  </div>
);
