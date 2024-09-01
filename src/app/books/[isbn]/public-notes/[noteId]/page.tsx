// src/app/books/[isbn]/public-notes/[noteId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteContent } from "~/app/_components/books/notes/detail/NoteContent";
import { AttachmentList } from "~/app/_components/books/notes/detail/AttachmentList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PublicNoteDetailPage = () => {
  const params = useParams();
  const noteId = Number(params.noteId);
  const isbn = params.isbn as string;

  const { data: note, isLoading } = api.note.getPublicNoteById.useQuery({
    id: noteId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            {note.title}
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
              onDownload={() => {}} // 公開メモの添付ファイルはダウンロードできないようにします
              downloadingAttachmentId={null}
            />
          )}
          <p className="text-sm text-gray-400 mt-4">
            作成者: {note.book.user.name}
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
