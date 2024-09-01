// src/hooks/useBookThreads.ts
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export const useBookThreads = (isbn: string) => {
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const { data: threads, refetch: refetchThreads } =
    api.bookThread.getThreads.useQuery({ isbn });
  const createThreadMutation = api.bookThread.createThread.useMutation();

  const handleCreateThread = async () => {
    if (!newThreadTitle || !newThreadContent) return;

    try {
      const thread = await createThreadMutation.mutateAsync({
        isbn,
        title: newThreadTitle,
        content: newThreadContent,
      });
      setNewThreadTitle("");
      setNewThreadContent("");
      await refetchThreads();
      toast({
        title: "スレッド作成",
        description: "新しいスレッドが作成されました。",
      });
      router.push(`/books/${isbn}/threads/${thread.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "エラー",
        description: "スレッドの作成中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const navigateToThread = (threadId: number) => {
    router.push(`/books/${isbn}/threads/${threadId}`);
  };

  return {
    threads,
    newThreadTitle,
    setNewThreadTitle,
    newThreadContent,
    setNewThreadContent,
    handleCreateThread,
    navigateToThread,
  };
};
