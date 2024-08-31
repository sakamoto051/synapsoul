import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import type { CommentType } from "~/types/thread";
import { TRPCError } from "@trpc/server";

export const useComments = (threadId: number) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const { data: thread, refetch: refetchThread } =
    api.bookThread.getThread.useQuery({ threadId });
  const createCommentMutation = api.bookThread.createComment.useMutation();
  const deleteCommentMutation = api.bookThread.deleteComment.useMutation();
  const editCommentMutation = api.bookThread.editComment.useMutation();
  const likeCommentMutation = api.bookThread.likeComment.useMutation();
  const unlikeCommentMutation = api.bookThread.unlikeComment.useMutation();

  const structuredComments = useMemo(() => {
    if (!thread?.comments) return [];
    const commentMap = new Map<number, CommentType>();
    const rootComments: CommentType[] = [];

    for (const comment of thread.comments) {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
        likes: comment.likes || [],
      });
    }

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

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        threadId,
        content: newComment,
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
      // コメントとその返信を再帰的に削除する関数
      const deleteCommentRecursively = async (id: number) => {
        const comment = thread?.comments.find(
          (c: { id: number }) => c.id === id,
        );
        if (!comment) return;

        // 子コメントを再帰的に削除
        for (const reply of comment.replies) {
          await deleteCommentRecursively(reply.id);
        }

        // コメントに関連する「いいね」を削除
        for (const like of comment.likes) {
          await unlikeCommentMutation.mutateAsync({
            commentId: id,
            userId: like.userId,
          });
        }

        // コメントを削除
        await deleteCommentMutation.mutateAsync({ commentId: id });
      };

      await deleteCommentRecursively(commentId);
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

  const handleLikeComment = async (commentId: number, userId: number) => {
    try {
      await likeCommentMutation.mutateAsync({ commentId });
      await refetchThread();
      toast({
        title: "いいね",
        description: "コメントにいいねしました。",
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      if (error instanceof TRPCError && error.code === "CONFLICT") {
        toast({
          title: "エラー",
          description: "既にいいねしています。",
          variant: "destructive",
        });
      } else {
        toast({
          title: "エラー",
          description: "いいねの処理中にエラーが発生しました。",
          variant: "destructive",
        });
      }
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

  return {
    thread,
    newComment,
    setNewComment,
    structuredComments,
    handleCreateComment,
    handleDeleteComment,
    handleEditComment,
    handleLikeComment,
    handleUnlikeComment,
    refetchThread,
  };
};
