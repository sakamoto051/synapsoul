import type React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Paperclip, X, Save, Globe, Lock } from "lucide-react";
import type { Attachment } from "@prisma/client";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

interface EditNoteFormProps {
  title: string;
  content: string;
  isPublic: boolean;
  existingAttachments: Attachment[];
  newAttachments: File[];
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onIsPublicChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveNewAttachment: (index: number) => void;
  markAttachmentForDeletion: (id: number) => void;
  onDelete: () => void;
}

export const EditNoteForm: React.FC<EditNoteFormProps> = ({
  title,
  content,
  isPublic,
  existingAttachments,
  newAttachments,
  onTitleChange,
  onContentChange,
  onIsPublicChange,
  onSubmit,
  onFileChange,
  onRemoveNewAttachment,
  markAttachmentForDeletion,
  onDelete,
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
        className="mt-1 bg-gray-700 text-white"
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
        className="mt-1 bg-gray-700 text-white"
        rows={10}
        required
      />
    </div>
    <div>
      <label
        htmlFor="attachments"
        className="block text-sm font-medium text-gray-300"
      >
        添付ファイル
      </label>
      <div className="mt-1 flex items-center">
        <Input
          id="attachments"
          type="file"
          onChange={onFileChange}
          className="hidden"
          multiple
        />
        <Button
          type="button"
          onClick={() => document.getElementById("attachments")?.click()}
          className="bg-gray-700 text-white hover:bg-gray-600"
        >
          <Paperclip className="mr-2 h-4 w-4" />
          ファイルを選択
        </Button>
      </div>
      <div className="mt-2 space-y-2">
        {existingAttachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between bg-gray-700 p-2 rounded"
          >
            <span className="text-sm text-gray-300">{attachment.fileName}</span>
            <Button
              type="button"
              onClick={() => markAttachmentForDeletion(attachment.id)}
              className="rounded-full bg-red-600 hover:bg-red-700 p-1 h-5 w-5"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {newAttachments.map((file, index) => (
          <div
            key={file.name}
            className="flex items-center justify-between bg-gray-700 p-2 rounded"
          >
            <span className="text-sm text-gray-300">{file.name}</span>
            <Button
              type="button"
              onClick={() => onRemoveNewAttachment(index)}
              className="rounded-full bg-red-600 hover:bg-red-700 p-1 h-5 w-5"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
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
      <DeleteNoteDialog onDelete={onDelete} />
      <Button
        type="submit"
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        <Save className="mr-2 h-4 w-4" />
        保存
      </Button>
    </div>
  </form>
);
