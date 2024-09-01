// src/components/NoteContent.tsx
import type React from "react";

interface NoteContentProps {
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
}

export const NoteContent: React.FC<NoteContentProps> = ({
  content,
  createdAt,
}) => (
  <div>
    <div className="mb-4">
      <p className="whitespace-pre-wrap text-gray-300">{content}</p>
    </div>
    <p className="text-sm text-gray-400">
      作成日: {new Date(createdAt).toLocaleString()}
    </p>
  </div>
);
