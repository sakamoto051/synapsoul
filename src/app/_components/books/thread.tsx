import React, { useState } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Send } from "lucide-react";

const BookThread = () => {
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const params = useParams();
  const isbn = params.isbn as string;
  const { toast } = useToast();

  const { data: threads, refetch: refetchThreads } =
    api.bookThread.getThreads.useQuery({ isbn });
  const createThreadMutation = api.bookThread.createThread.useMutation();
  const createCommentMutation = api.bookThread.createComment.useMutation();

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

  const handleCreateComment = async (threadId: string) => {
    if (!newComment) return;

    try {
      await createCommentMutation.mutateAsync({
        threadId,
        content: newComment,
      });
      setNewComment("");
      await refetchThreads();
      toast({
        title: "コメント投稿",
        description: "コメントが投稿されました。",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "エラー",
        description: "コメントの投稿中にエラーが発生しました。",
        variant: "destructive",
      });
    }
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
            <p className="mb-4">{thread.content}</p>
            <div className="space-y-4">
              {thread.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-700 p-3 rounded-md">
                  <p>{comment.content}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <Input
                placeholder="コメントを追加"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow mr-2 bg-gray-700 text-gray-100 border-gray-600"
              />
              <Button
                onClick={() => handleCreateComment(thread.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                送信
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookThread;
