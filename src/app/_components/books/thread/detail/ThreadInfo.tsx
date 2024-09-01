// src/app/_components/books/thread/detail/ThreadInfo.tsx
import type React from "react";
import type { ThreadType } from "~/types/thread";

interface ThreadInfoProps {
  thread: ThreadType;
}

export const ThreadInfo: React.FC<ThreadInfoProps> = ({ thread }) => (
  <div className="bg-gray-800/70 text-gray-200 rounded-lg shadow-lg mb-4 p-4">
    <h1 className="text-xl font-bold text-indigo-300 mb-2">{thread.title}</h1>
    <p className="mb-4 text-sm">{thread.content}</p>
  </div>
);
