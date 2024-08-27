export interface LikeType {
  id: string;
  userId: string;
  createdAt: Date;
}

export interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  replies: CommentType[];
  likes: LikeType[];
}

export interface ThreadType {
  id: string;
  title: string;
  content: string;
  comments: CommentType[];
}
