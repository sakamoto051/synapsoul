// src/components/BookNoteForm.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Save } from "lucide-react";

interface BookNoteFormProps {
  title: string;
  content: string;
  isPublic: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const BookNoteForm: React.FC<BookNoteFormProps> = ({
  title,
  content,
  isPublic,
  onTitleChange,
  onContentChange,
  onIsPublicChange,
  onSubmit,
  onBack,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-300"
      >
        タイトル
      </label>
      <Input
        id="title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="mt-1 bg-gray-700 text-white border-gray-600"
        required
      />
    </div>
    <div>
      <label
        htmlFor="content"
        className="block text-sm font-medium text-gray-300"
      >
        内容
      </label>
      <Textarea
        id="content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="mt-1 bg-gray-700 text-white border-gray-600"
        rows={10}
        required
      />
    </div>
    <div className="flex items-center space-x-2">
      <Switch
        id="isPublic"
        checked={isPublic}
        onCheckedChange={onIsPublicChange}
      />
      <label htmlFor="isPublic">公開する</label>
    </div>
    <div className="flex justify-between">
      <Button
        type="button"
        onClick={onBack}
        className="bg-gray-700 text-white hover:bg-gray-600"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        戻る
      </Button>
      <Button
        type="submit"
        className="bg-green-600 text-white hover:bg-green-700"
      >
        <Save className="mr-2 h-4 w-4" />
        保存
      </Button>
    </div>
  </form>
);
