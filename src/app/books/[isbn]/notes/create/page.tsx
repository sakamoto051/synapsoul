// src/app/books/[isbn]/notes/new/page.tsx
"use client";
import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreateBookNote } from "~/hooks/useCreateBookNote";
import { BookNoteForm } from "~/app/_components/books/notes/create/BookNoteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewBookNote: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const isbn = params.isbn as string;

  const {
    title,
    setTitle,
    content,
    setContent,
    isPublic,
    setIsPublic,
    handleSubmit,
  } = useCreateBookNote(isbn);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            新しい読書メモ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BookNoteForm
            title={title}
            content={content}
            isPublic={isPublic}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onIsPublicChange={setIsPublic}
            onSubmit={handleSubmit}
            onBack={() => router.push(`/books/${isbn}/notes`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewBookNote;
