import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, ArrowRight } from "lucide-react";

const BookThreadList = () => {
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const params = useParams();
  const router = useRouter();
  const isbn = params.isbn as string;
  const { toast } = useToast();

  const { data: threads, refetch: refetchThreads } =
    api.bookThread.getThreads.useQuery({ isbn });
  const createThreadMutation = api.bookThread.createThread.useMutation();

  const handleCreateThread = async () => {
    if (!newThreadTitle || !newThreadContent) return;

    try {
      await createThreadMutation.mutateAsync({
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
    } catch (error) {
      console.error("Error creating thread:", error);
      toast({
        title: "エラー",
        description: "スレッドの作成中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const navigateToThread = (threadId: string) => {
    router.push(`/books/${isbn}/threads/${threadId}`);
  };

  return (
    <div className="mt-8">
      <Card className="bg-gray-800 text-gray-100 border-none shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-300">
            新しいスレッドを作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="スレッドのタイトル"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            className="mb-4 bg-gray-700 text-gray-100 border-gray-600"
          />
          <Textarea
            placeholder="スレッドの内容"
            value={newThreadContent}
            onChange={(e) => setNewThreadContent(e.target.value)}
            className="mb-4 bg-gray-700 text-gray-100 border-gray-600"
          />
          <Button
            onClick={handleCreateThread}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            スレッドを作成
          </Button>
        </CardContent>
      </Card>

      {threads?.map((thread) => (
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
              onClick={() => navigateToThread(thread.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              詳細を見る
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookThreadList;
