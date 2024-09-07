// src/app/_components/FeedbackList.tsx
"use client";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";

export function FeedbackList() {
  const { data: feedbacks, isLoading } = api.feedback.getAll.useQuery();

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="space-y-4">
      {feedbacks?.map((feedback) => (
        <Card key={feedback.id}>
          <div className="m-4">
            <p>{feedback.content}</p>
            <p className="text-sm text-gray-500">
              {new Date(feedback.createdAt).toLocaleString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
