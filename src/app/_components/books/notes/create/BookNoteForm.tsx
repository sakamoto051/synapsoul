import type React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Save, Globe, Lock } from "lucide-react";

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
    <div className="flex items-center space-x-2 bg-gray-700 p-4 rounded-lg">
      <Switch
        id="isPublic"
        checked={isPublic}
        onCheckedChange={onIsPublicChange}
        className={`${
          isPublic ? "bg-green-600" : "bg-red-600"
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800`}
      >
        <span
          className={`${
            isPublic ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <label
        htmlFor="isPublic"
        className="text-sm font-medium text-gray-300 flex items-center"
      >
        {isPublic ? (
          <>
            <Globe className="h-4 w-4 mr-2 text-green-500" />
            公開
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2 text-red-500" />
            非公開
          </>
        )}
      </label>
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
