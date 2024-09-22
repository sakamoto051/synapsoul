// src/types/thread.ts
import type {
  BookThread as PrismaBookThread,
  Comment as PrismaComment,
  Like as PrismaLike,
} from "@prisma/client";

export type BookThread = PrismaBookThread;
export type Comment = PrismaComment;
export type Like = PrismaLike;

export type CommentWithRepliesAndLikes = Comment & {
  replies: CommentWithRepliesAndLikes[];
  likes: Like[];
};

export type ThreadType = BookThread & {
  comments: CommentWithRepliesAndLikes[];
};
