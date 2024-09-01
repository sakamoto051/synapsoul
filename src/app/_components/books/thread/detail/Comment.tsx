// src/components/Comment.tsx
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  ThumbsUp,
  Edit2,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { CommentWithRepliesAndLikes } from "~/types/thread";
import { useSession } from "next-auth/react";

interface CommentProps {
  comment: CommentWithRepliesAndLikes;
  onReply: (parentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newContent: string) => void;
  onLike: (commentId: number) => void;
  onUnlike: (commentId: number, userId: number) => void;
  currentUserId: number;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onReply,
  onDelete,
  onEdit,
  onLike,
  onUnlike,
  currentUserId,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(true);
  const isLiked = comment.likes.some((like) => like.userId === currentUserId);
  const { data: session } = useSession();
  const isCommentOwner = Number(session?.user?.id) === comment.userId;

  const handleLike = () => {
    if (isLiked) {
      onUnlike(comment.id, currentUserId);
    } else {
      onLike(comment.id);
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-start space-x-2">
        <div className="flex-grow">
          {isEditing ? (
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2 bg-gray-700/50 text-gray-200 border-gray-600/50 text-sm"
            />
          ) : (
            <p className="text-gray-300 text-sm">{comment.content}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {comment.createdAt.toLocaleString()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`p-1 ${isLiked ? "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" : "text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"}`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="ml-1">{comment.likes.length}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 p-1"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        {isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onEdit(comment.id, editContent);
              setIsEditing(false);
            }}
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-1"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          isCommentOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-1"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )
        )}
        {isCommentOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {comment.replies && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 p-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {isReplying && (
        <div className="mt-2 ml-4">
          <Input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="返信を入力"
            className="mb-2 bg-gray-700/50 text-gray-200 border-gray-600/50 text-sm"
          />
          <Button
            onClick={handleReply}
            className="bg-indigo-600/70 hover:bg-ind-700/70 text-gray-200 px-3 py-2"
          >
            <Send className="h-4 w-4 mr-2" />
            返信
          </Button>
        </div>
      )}
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2 ml-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit}
              onLike={onLike}
              onUnlike={onUnlike}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
