// src/app/books/[isbn]/notes/[noteId]/page.tsx
"use client";
import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookNoteDetail } from "~/hooks/useBookNoteDetail";
import { NoteContent } from "~/app/_components/books/notes/detail/NoteContent";
import { AttachmentList } from "~/app/_components/books/notes/detail/AttachmentList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

const ViewNotePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const isbn = params.isbn as string;
  const noteId = Number(params.noteId);

  const {
    note,
    isLoading,
    error,
    handleDownload,
    handleEdit,
    downloadQuery,
    downloadingAttachmentId,
  } = useBookNoteDetail(isbn, noteId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

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
          {note.attachments.length > 0 && (
            <AttachmentList
              attachments={note.attachments}
              onDownload={handleDownload}
              downloadingAttachmentId={downloadingAttachmentId}
            />
          )}
          <div className="flex justify-between mt-6">
            <Button
              onClick={() => router.push(`/books/${isbn}/notes`)}
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              メモ一覧に戻る
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Edit className="h-4 w-4 mr-1" />
              メモを編集
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewNotePage;
