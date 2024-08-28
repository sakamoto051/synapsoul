"use client";
import type React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useComments } from "./comment/useComments";
import { Comment } from "./comment/comment";

const BookThreadDetail: React.FC = () => {
  const params = useParams();
  const threadId = params.threadId as string;
  const userId = "current-user-id"; // 実際のユーザー認証システムから取得する必要があります

  const {
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
  } = useComments(threadId, userId);

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-900 min-h-screen">
      <div className="bg-gray-800/70 text-gray-200 rounded-lg shadow-lg mb-4 p-4">
        <h1 className="text-xl font-bold text-indigo-300 mb-2">
          {thread.title}
        </h1>
        <p className="mb-4 text-sm">{thread.content}</p>
        <Link href={`/flowchart/${threadId}`} passHref>
          <Button className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white">
            フローチャートを編集
          </Button>
        </Link>
        <div className="space-y-2 mt-4">
          {structuredComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              threadId={threadId}
              userId={userId}
              onReply={refetchThread}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              onLike={handleLikeComment}
              onUnlike={handleUnlikeComment}
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
