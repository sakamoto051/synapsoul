// src/app/books/[isbn]/public-notes/[noteId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useBookNoteDetail } from "~/hooks/useBookNoteDetail";
import AttachmentList from "~/app/_components/books/notes/AttachmentList";
import { Suspense } from "react";
import { PublicBadge } from "~/app/_components/books/notes/PublicBadge";

const PublicNoteDetailPage = () => {
  const params = useParams();
  const noteId = Number(params.noteId);
  const isbn = params.isbn as string;

  const { note } = useBookNoteDetail(isbn, noteId);

  if (!note) return <div>Note not found</div>;

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
          <Suspense>
            <AttachmentList noteId={noteId} />
          </Suspense>
          <p className="text-sm text-gray-400 mt-4">
            作成者: {note.book.user.displayName}
          </p>
          <div className="mt-6">
            <Link href={`/books/${isbn}/public-notes`} passHref>
              <Button className="bg-gray-700 text-white hover:bg-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                公開メモ一覧に戻る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicNoteDetailPage;
