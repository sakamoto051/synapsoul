'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send, ChevronLeft } from "lucide-react";

const BookThreadDetail = () => {
  const [newComment, setNewComment] = useState('');
  const params = useParams();
  const router = useRouter();
  const threadId = params['threadId'] as string;
  const isbn = params['isbn'] as string;
  const { toast } = useToast();

  const { data: thread, refetch: refetchThread } = api.bookThread.getThread.useQuery({ threadId });
  const createCommentMutation = api.bookThread.createComment.useMutation();

  const handleCreateComment = async () => {
    if (!newComment) return;

    try {
      await createCommentMutation.mutateAsync({
        threadId,
        content: newComment,
      });
      setNewComment('');
      await refetchThread();
      toast({
        title: "コメント投稿",
        description: "コメントが投稿されました。",
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "エラー",
        description: "コメントの投稿中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    router.push(`/books/${isbn}`);
  };

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBack} className="mb-4 bg-gray-700 text-white hover:bg-gray-600">
        <ChevronLeft className="mr-2 h-4 w-4" />
        戻る
      </Button>
      <Card className="bg-gray-800 text-gray-100 border-none shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-300">{thread.title}</CardTitle>
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
            <Button onClick={handleCreateComment} className="bg-green-600 hover:bg-green-700 text-white">
              <Send className="mr-2 h-4 w-4" />
              送信
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookThreadDetail;