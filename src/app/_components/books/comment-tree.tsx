import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Flag } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  avatarUrl?: string;
  likes: number;
  replies: Comment[];
}

interface CommentTreeProps {
  comment: Comment;
  depth?: number;
}

const CommentTree: React.FC<CommentTreeProps> = ({ comment, depth = 0 }) => {
  return (
    <Card className={`my-2 ${depth > 0 ? 'ml-4' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={comment.avatarUrl} alt={comment.author} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{comment.author}</p>
            <p className="text-sm text-gray-500 mt-1">{comment.content}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {comment.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Reply
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4 mr-1" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      {comment.replies.length > 0 && (
        <div className="ml-8">
          {comment.replies.map((reply) => (
            <CommentTree key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentTree;