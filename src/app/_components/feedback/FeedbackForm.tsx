// src/app/_components/FeedbackForm.tsx
"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";

export function FeedbackForm() {
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const utils = api.useUtils();

  const createFeedback = api.feedback.create.useMutation({
    onSuccess: async () => {
      setContent("");
      await utils.feedback.getAll.invalidate();
      toast({ title: "フィードバックを送信しました。ありがとうございます！" });
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFeedback.mutate({ content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="フィードバックを入力してください"
        className="min-h-[100px] bg-gray-700 border-none text-white"
      />
      <Button type="submit" disabled={createFeedback.isPending}>
        {createFeedback.isPending ? "送信中..." : "フィードバックを送信"}
      </Button>
    </form>
  );
}
