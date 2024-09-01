// src/app/_components/books/thread/detail/ThreadDetail.tsx
"use client";
import type React from "react";
import { useParams } from "next/navigation";
import { useThreadDetail } from "~/hooks/useThreadDetail";
import { ThreadInfo } from "./ThreadInfo";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useSession } from "next-auth/react";

const ThreadDetail: React.FC = () => {
  const params = useParams();
  const threadId = Number(params.threadId);
  const { data: session } = useSession();
  const currentUserId = Number(session?.user?.id);

  const {
    thread,
    newComment,
    setNewComment,
    handleCreateComment,
    handleDeleteComment,
    handleEditComment,
    handleLikeComment,
    handleUnlikeComment,
    structuredComments,
  } = useThreadDetail(threadId);

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-900 min-h-screen">
      <ThreadInfo thread={thread} />
      <CommentList
        comments={structuredComments}
        onReply={handleCreateComment}
        onDelete={handleDeleteComment}
        onEdit={handleEditComment}
        onLike={handleLikeComment}
        onUnlike={handleUnlikeComment}
        currentUserId={currentUserId}
      />
      <CommentForm
        value={newComment}
        onChange={setNewComment}
        onSubmit={() => handleCreateComment(null, newComment)}
      />
    </div>
  );
};

export default ThreadDetail;
