// src/app/_components/FeedbackForm.tsx
"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function FeedbackForm() {
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const utils = api.useUtils();
  const session = useSession();
  const router = useRouter();

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
      {session.data?.user?.id ? (
        <Button
          type="submit"
          disabled={createFeedback.isPending}
          className="bg-gray-700 hover:bg-gray-800 text-white"
        >
          {createFeedback.isPending ? "送信中..." : "フィードバックを送信"}
        </Button>
      ) : (
        <Button
          className="w-full bg-gray-600 text-white"
          onClick={() => {
            router.push("/api/auth/signin");
          }}
        >
          ログインしてフィードバックを投稿する
        </Button>
      )}
    </form>
  );
}
