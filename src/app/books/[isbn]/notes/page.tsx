// src/app/books/[isbn]/notes/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useBookNotes } from "~/hooks/useBookNotes";
import { NoteList } from "~/app/_components/books/notes/NoteList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookNotesActions } from "~/app/_components/books/notes/BookNotesActions";

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
          <BookNotesActions isbn={isbn} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookNotesList;
