// src/app/books/[isbn]/notes/[noteId]/edit/page.tsx
"use client";
import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditBookNote } from "~/hooks/useEditBookNote";
import { EditNoteForm } from "~/app/_components/books/notes/edit/EditNoteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const EditNotePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const isbn = params.isbn as string;
  const noteId = Number(params.noteId);

  const {
    title,
    setTitle,
    content,
    setContent,
    isPublic,
    setIsPublic,
    existingAttachments,
    newAttachments,
    handleSubmit,
    handleDelete,
    handleFileChange,
    removeNewAttachment,
    removeExistingAttachment,
  } = useEditBookNote(isbn, noteId);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            読書メモを編集
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditNoteForm
            title={title}
            content={content}
            isPublic={isPublic}
            existingAttachments={existingAttachments}
            newAttachments={newAttachments}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onIsPublicChange={setIsPublic}
            onSubmit={handleSubmit}
            onFileChange={handleFileChange}
            onRemoveNewAttachment={removeNewAttachment}
            onRemoveExistingAttachment={removeExistingAttachment}
            onDelete={() => {}} // AlertDialogを表示するため、ここでは空の関数を渡す
          />
        </CardContent>
      </Card>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button" className="sr-only">
            Delete Note
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              本当にこのノートを削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。ノートと関連するすべての添付ファイルが完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditNotePage;
