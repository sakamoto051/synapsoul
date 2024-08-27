import { useState, useMemo } from 'react';
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { CommentType } from '~/types/thread';

export const useComments = (threadId: string) => {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const { data: thread, refetch: refetchThread } = api.bookThread.getThread.useQuery({ threadId });
  const createCommentMutation = api.bookThread.createComment.useMutation();
  const deleteCommentMutation = api.bookThread.deleteComment.useMutation();
  const editCommentMutation = api.bookThread.editComment.useMutation();

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
  
  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await editCommentMutation.mutateAsync({ commentId, content: newContent });
      await refetchThread();
      toast({
        title: "コメント編集",
        description: "コメントが編集されました。",
      });
    } catch (error) {
      console.error('Error editing comment:', error);
      toast({
        title: "エラー",
        description: "コメントの編集中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  return {
    thread,
    newComment,
    setNewComment,
    structuredComments,
    handleCreateComment,
    handleDeleteComment,
    handleEditComment,
    refetchThread,
  };
};