"use client";
import type React from "react";
import { useParams } from "next/navigation";
import { useEditBookNote } from "~/hooks/useEditBookNote";
import { EditNoteForm } from "~/app/_components/books/notes/edit/EditNoteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingOverlay from "~/components/ui/loading-overlay";

const EditNotePage: React.FC = () => {
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
    isLoading,
  } = useEditBookNote(isbn, noteId);

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingOverlay isLoading={isLoading} />
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
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditNotePage;
