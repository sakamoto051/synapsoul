import React, { useState } from 'react';
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send, Reply } from "lucide-react";

interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  replies?: CommentType[];
}

interface CommentProps {
  comment: CommentType;
  threadId: string;
  onReply: () => void;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({ comment, threadId, onReply, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const createReplyMutation = api.bookThread.createReply.useMutation();
  const { toast } = useToast();

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await createReplyMutation.mutateAsync({
        threadId,
        parentId: comment.id,
        content: replyContent,
      });
      setReplyContent('');
      setIsReplying(false);
      onReply();
      toast({
        title: "返信投稿",
        description: "返信が投稿されました。",
      });
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "エラー",
        description: "返信の投稿中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-4' : ''}`}>
      <div className={`bg-gray-${700 - depth * 100} p-3 rounded-md`}>
        <p>{comment.content}</p>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
        {depth < 3 && (
          <Button
            onClick={() => setIsReplying(!isReplying)}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Reply className="mr-2 h-4 w-4" />
            返信
          </Button>
        )}
      </div>
      {isReplying && (
        <div className="mt-2 ml-4">
          <Input
            placeholder="返信を入力"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-2 bg-gray-700 text-gray-100 border-gray-600"
          />
          <Button onClick={handleReply} className="bg-green-600 hover:bg-green-700 text-white">
            <Send className="mr-2 h-4 w-4" />
            返信を送信
          </Button>
        </div>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          threadId={threadId}
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export default Comment;