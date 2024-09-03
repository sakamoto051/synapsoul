import React from "react";
import Link from "next/link";
import { api } from "~/trpc/server";
import { NoteContent } from "~/app/_components/books/notes/detail/NoteContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import AttachmentList from "~/app/_components/books/notes/AttachmentList";

export default async function ViewNotePage({
  params,
}: { params: { isbn: string; noteId: string } }) {
  const noteId = Number(params.noteId);
  const note = await api.note.getById({ id: noteId });

  if (!note) {
    return <div>メモが見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardContent className="p-6">
          <NoteContent
            title={note.title}
            content={note.content}
            isPublic={note.isPublic}
            createdAt={note.createdAt}
          />
          <AttachmentList noteId={noteId} />
          <div className="flex justify-between mt-6">
            <Link href={`/books/${params.isbn}/notes`} passHref>
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                メモ一覧に戻る
              </Button>
            </Link>
            <Link
              href={`/books/${params.isbn}/notes/${params.noteId}/edit`}
              passHref
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Edit className="h-4 w-4 mr-1" />
                メモを編集
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
