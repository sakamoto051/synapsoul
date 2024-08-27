export interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  replies: CommentType[];
}

export interface ThreadType {
  id: string;
  title: string;
  content: string;
  comments: CommentType[];
}
