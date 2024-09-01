// src/hooks/useThreadDetail.ts
import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import type { ThreadType, CommentType } from "~/types/thread";

export const useThreadDetail = (threadId: number) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const { data: thread, refetch: refetchThread } =
    api.bookThread.getThread.useQuery({ threadId });
  const createCommentMutation = api.bookThread.createComment.useMutation();
  const deleteCommentMutation = api.bookThread.deleteComment.useMutation();
  const editCommentMutation = api.bookThread.editComment.useMutation();
  const likeCommentMutation = api.bookThread.likeComment.useMutation();
  const unlikeCommentMutation = api.bookThread.unlikeComment.useMutation();

  const handleCreateComment = async (
    parentId: number | null,
    content: string,
  ) => {
    if (!content.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        threadId,
        parentId, // ここにparentIdを追加
        content,
      });
      setNewComment("");
      await refetchThread();
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

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId });
      await refetchThread();
      toast({
        title: "コメント削除",
        description: "コメントが削除されました。",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "エラー",
        description: "コメントの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      await editCommentMutation.mutateAsync({ commentId, content: newContent });
      await refetchThread();
      toast({
        title: "コメント編集",
        description: "コメントが編集されました。",
      });
    } catch (error) {
      console.error("Error editing comment:", error);
      toast({
        title: "エラー",
        description: "コメントの編集中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await likeCommentMutation.mutateAsync({ commentId });
      await refetchThread();
      toast({
        title: "いいね",
        description: "コメントにいいねしました。",
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "エラー",
        description: "いいねの処理中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleUnlikeComment = async (commentId: number, userId: number) => {
    try {
      await unlikeCommentMutation.mutateAsync({ commentId, userId });
      await refetchThread();
      toast({
        title: "いいね取り消し",
        description: "コメントのいいねを取り消しました。",
      });
    } catch (error) {
      console.error("Error unliking comment:", error);
      toast({
        title: "エラー",
        description: "いいね取り消しの処理中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const structuredComments = useMemo(() => {
    if (!thread?.comments) return [];

    const commentMap = new Map<number, CommentType>();
    const rootComments: CommentType[] = [];

    // すべてのコメントをマップに追加
    for (const comment of thread.comments) {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      });
    }

    // 返信を適切な親コメントに追加
    for (const comment of thread.comments) {
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.replies.push(commentMap.get(comment.id) as CommentType);
        }
      } else {
        rootComments.push(commentMap.get(comment.id) as CommentType);
      }
    }

    return rootComments;
  }, [thread?.comments]);

  return {
    thread: thread as ThreadType | undefined,
    newComment,
    setNewComment,
    handleCreateComment,
    handleDeleteComment,
    handleEditComment,
    handleLikeComment,
    handleUnlikeComment,
    refetchThread,
    structuredComments,
  };
};
