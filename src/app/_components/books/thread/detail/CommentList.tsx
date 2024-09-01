// src/app/_components/books/thread/detail/CommentList.tsx
import type React from "react";
import { Comment } from "./Comment";
import type { CommentType } from "~/types/thread";

interface CommentListProps {
  comments: CommentType[];
  onReply: (parentId: number | null, content: string) => void;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newContent: string) => void;
  onLike: (commentId: number) => void;
  onUnlike: (commentId: number, userId: number) => void;
  currentUserId: number;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onReply,
  onDelete,
  onEdit,
  onLike,
  onUnlike,
  currentUserId,
}) => (
  <div className="space-y-2 mt-4">
    {comments.map((comment) => (
      <Comment
        key={comment.id}
        comment={comment}
        onReply={onReply}
        onDelete={onDelete}
        onEdit={onEdit}
        onLike={onLike}
        onUnlike={onUnlike}
        currentUserId={currentUserId}
      />
    ))}
  </div>
);
