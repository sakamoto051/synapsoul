'use client';
import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Send, MessageCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

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

const Comment: React.FC<{
  comment: CommentType;
  threadId: string;
  onReply: () => void;
  onDelete: (commentId: string) => void;
  depth?: number;
}> = ({ comment, threadId, onReply, onDelete, depth = 0 }) => {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const createReplyMutation = api.bookThread.createReply.useMutation();

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

  const handleDelete = () => {
    onDelete(comment.id);
  };

  return (
    <div className={`py-2 ${depth > 0 ? 'ml-4' : ''}`}>
      <div className="flex items-start space-x-2">
        <div className={`w-0.5 self-stretch ${depth > 0 ? 'bg-gray-700' : 'bg-transparent'}`} />
        <div className="flex-grow">
          <p className="text-gray-300 text-sm">{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 p-1"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>コメントを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。本当にこのコメントを削除しますか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {comment.replies.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 p-1"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </div>
      {isReplying && (
        <div className="mt-2 flex space-x-2">
          <Input
            placeholder="返信を入力"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="flex-grow bg-gray-700/50 text-gray-200 border-gray-600/50 text-sm"
          />
          <Button onClick={handleReply} className="bg-indigo-600/70 hover:bg-indigo-700/70 text-gray-200 px-2 py-1">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
      {isExpanded && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              threadId={threadId}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookThreadDetail: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const params = useParams();
  const threadId = params['threadId'] as string;
  const { toast } = useToast();

  const { data: thread, refetch: refetchThread } = api.bookThread.getThread.useQuery({ threadId });
  const createCommentMutation = api.bookThread.createComment.useMutation();
  const deleteCommentMutation = api.bookThread.deleteComment.useMutation();

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

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId });
      await refetchThread();
      toast({
        title: "コメント削除",
        description: "コメントが削除されました。",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "エラー",
        description: "コメントの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-900 min-h-screen">
      <div className="bg-gray-800/70 text-gray-200 rounded-lg shadow-lg mb-4 p-4">
        <h1 className="text-xl font-bold text-indigo-300 mb-2">{thread.title}</h1>
        <p className="mb-4 text-sm">{thread.content}</p>
        <div className="space-y-2">
          {structuredComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              threadId={threadId}
              onReply={refetchThread}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <Input
            placeholder="新しいコメントを追加"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow bg-gray-700/50 text-gray-200 border-gray-600/50 text-sm"
          />
          <Button
            onClick={handleCreateComment}
            className="bg-indigo-600/70 hover:bg-indigo-700/70 text-gray-200 px-3 py-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookThreadDetail;