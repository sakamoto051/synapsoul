// src/app/books/[isbn]/public-notes/page.tsx

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PublicNotes = () => {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: publicNotes, isLoading } =
    api.note.getPublicNotesByIsbn.useQuery({
      isbn: isbn,
    });

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">公開された読書メモ</h1>
      {publicNotes?.map((note) => (
        <Card key={note.id} className="mb-4">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{note.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              作成者: {note.book.user.name}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PublicNotes;
