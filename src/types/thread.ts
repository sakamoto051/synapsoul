export interface LikeType {
  id: number;
  userId: number;
  createdAt: Date;
}

export interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  parentId: number | null;
  replies: CommentType[];
  likes: LikeType[];
}

export interface ThreadType {
  id: number;
  title: string;
  content: string;
  comments: CommentType[];
}
