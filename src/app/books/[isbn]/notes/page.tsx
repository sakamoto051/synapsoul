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
    <div className="mx-auto p-4 mt-12">
      <Card className="w-full mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-300">
            読書メモ一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {book?.notes && book.notes.length > 0 ? (
            <NoteList notes={book.notes} isbn={isbn} />
          ) : (
            <p className="text-center text-gray-400">
              まだ読書メモがありません。
            </p>
          )}
          {!book && (
            <p className="text-center text-gray-400">
              本のステータスを設定すると読書メモを作成できます。
            </p>
          )}
          <BookNotesActions isbn={isbn} book={book} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookNotesList;
