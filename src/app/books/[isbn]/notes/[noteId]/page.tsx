import React from "react";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import AttachmentList from "~/app/_components/books/notes/AttachmentList";
import { PublicBadge } from "~/app/_components/books/notes/PublicBadge";

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
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-blue-300">{note.title}</h1>
              <PublicBadge isPublic={note.isPublic} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="whitespace-pre-wrap text-gray-300">{note.content}</p>
          </div>
          <p className="text-sm text-gray-400">
            作成日: {new Date(note.createdAt).toLocaleString()}
          </p>
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
