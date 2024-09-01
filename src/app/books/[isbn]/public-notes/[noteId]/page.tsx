// src/app/books/[isbn]/public-notes/[noteId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteContent } from "~/app/_components/books/notes/detail/NoteContent";
import { AttachmentList } from "~/app/_components/books/notes/detail/AttachmentList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { useBookNoteDetail } from "~/hooks/useBookNoteDetail";

const PublicNoteDetailPage = () => {
  const params = useParams();
  const noteId = Number(params.noteId);
  const isbn = params.isbn as string;

  const { note, handleDownload, downloadingAttachmentId } = useBookNoteDetail(
    isbn,
    noteId,
  );

  if (!note) return <div>Note not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-blue-300">{note.title}</h1>
              <Badge
                variant={note.isPublic ? "default" : "secondary"}
                className="ml-2"
              >
                {note.isPublic ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    公開
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    非公開
                  </>
                )}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
