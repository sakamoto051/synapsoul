// src/app/books/[isbn]/notes/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBookNotes } from "~/hooks/useBookNotes";
import { NoteList } from "~/app/_components/books/notes/NoteList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft } from "lucide-react";

const BookNotesList = () => {
  const params = useParams();
  const isbn = params.isbn as string;
  const { book } = useBookNotes(isbn);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            読書メモ一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          {book?.notes && book.notes.length > 0 ? (
            <NoteList notes={book.notes} isbn={isbn} />
          ) : (
            <p className="text-center text-gray-400">
              まだ読書メモがありません。
            </p>
          )}
          <div className="mt-6 flex justify-between">
            <Link href={`/books/${isbn}`} passHref>
              <Button className="bg-gray-700 text-white hover:bg-gray-600">
                <ChevronLeft className="mr-2 h-4 w-4" />
                書籍詳細に戻る
              </Button>
            </Link>
            <Link href={`/books/${isbn}/notes/create`} passHref>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                新しい読書メモ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookNotesList;
