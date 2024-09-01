// src/app/books/[isbn]/public-notes/page.tsx
"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const PublicNotes = () => {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: publicNotes } = api.note.getPublicNotesByIsbn.useQuery({
    isbn: isbn,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">公開された読書メモ</h1>
      {publicNotes?.map((note) => (
        <Link href={`/books/${isbn}/public-notes/${note.id}`} key={note.id}>
          <Card className="mb-4 bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-blue-300">{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 line-clamp-3">{note.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                作成者: {note.book.user.displayName}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default PublicNotes;
