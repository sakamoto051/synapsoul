// src/components/NewThreadForm.tsx
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface NewThreadFormProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

export const NewThreadForm: React.FC<NewThreadFormProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
}) => (
  <Card className="bg-gray-800 text-gray-100 border-none shadow-lg mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-blue-300">
        新しいスレッドを作成
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Input
        placeholder="スレッドのタイトル"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="mb-4 bg-gray-700 text-gray-100 border-gray-600"
      />
      <Textarea
        placeholder="スレッドの内容"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="mb-4 bg-gray-700 text-gray-100 border-gray-600"
      />
      <Button
        onClick={onSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        スレッドを作成
      </Button>
    </CardContent>
  </Card>
);
