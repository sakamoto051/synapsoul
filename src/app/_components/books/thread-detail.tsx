'use client';
import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import Comment from './comment';

interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  replies: CommentType[];
}

interface ThreadType {
  id: string;
  title: string;
  content: string;
  comments: CommentType[];
}

const BookThreadDetail: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const params = useParams();
  const threadId = params['threadId'] as string;
  const { toast } = useToast();

  const { data: thread, refetch: refetchThread } = api.bookThread.getThread.useQuery({ threadId });
  const createCommentMutation = api.bookThread.createComment.useMutation();

  const structuredComments = useMemo(() => {
    if (!thread?.comments) return [];
    const commentMap = new Map<string, CommentType>();
    const rootComments: CommentType[] = [];

    thread.comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    thread.comments.forEach(comment => {
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.replies.push(commentMap.get(comment.id) as CommentType);
        }
      } else {
        rootComments.push(commentMap.get(comment.id) as CommentType);
      }
    });

    return rootComments;
  }, [thread?.comments]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

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

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-gray-800 text-gray-100 border-none shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-300">{thread.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{thread.content}</p>
          <div className="space-y-4">
            {structuredComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                threadId={threadId}
                onReply={refetchThread}
              />
            ))}
          </div>
          <div className="mt-6">
            <Input
              placeholder="新しいコメントを追加"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 bg-gray-700 text-gray-100 border-gray-600"
            />
            <Button
              onClick={handleCreateComment}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              コメントを投稿
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookThreadDetail;