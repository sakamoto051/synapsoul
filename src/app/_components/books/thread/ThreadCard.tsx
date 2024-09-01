// src/components/ThreadCard.tsx
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { BookThread } from "@prisma/client";

interface ThreadCardProps {
  thread: BookThread;
  onNavigate: (threadId: number) => void;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  onNavigate,
}) => (
  <Card
    key={thread.id}
    className="bg-gray-800 text-gray-100 border-none shadow-lg mb-6"
  >
    <CardHeader>
      <CardTitle className="text-lg font-bold text-blue-300">
        {thread.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-4 line-clamp-3">{thread.content}</p>
      <Button
        onClick={() => onNavigate(thread.id)}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        詳細を見る
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);
