// src/components/ThreadDetail.tsx
"use client";
import type React from "react";
import { useParams } from "next/navigation";
import { useThreadDetail } from "~/hooks/useThreadDetail";
import { CommentForm } from "./CommentForm";
import { Comment } from "./Comment";
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
  } = useThreadDetail(threadId);

  if (!thread) return;

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-900 min-h-screen">
      <div className="bg-gray-800/70 text-gray-200 rounded-lg shadow-lg mb-4 p-4">
        <h1 className="text-xl font-bold text-indigo-300 mb-2">
          {thread.title}
        </h1>
        <p className="mb-4 text-sm">{thread.content}</p>
        <div className="space-y-2 mt-4">
          {thread.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={(parentId, content) =>
                handleCreateComment(parentId, content)
              }
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              onLike={handleLikeComment}
              onUnlike={handleUnlikeComment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
        <CommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={() => handleCreateComment(null, newComment)}
        />
      </div>
    </div>
  );
};

export default ThreadDetail;
