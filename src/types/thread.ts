// src/types/thread.ts
import type { Comment, Like } from "@prisma/client";

export type CommentWithRepliesAndLikes = Comment & {
  replies: CommentWithRepliesAndLikes[];
  likes: Like[];
};

export interface ThreadType {
  id: number;
  title: string;
  content: string;
  comments: CommentWithRepliesAndLikes[];
}

export type CommentType = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  threadId: number;
  userId: number;
  parentId: number | null;
  replies: CommentType[];
  likes: Like[];
};
