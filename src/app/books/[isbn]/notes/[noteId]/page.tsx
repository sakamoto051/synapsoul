// src/app/books/[isbn]/notes/[noteId]/page.tsx

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Download } from "lucide-react";

const ViewNotePage = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const isbn = params.isbn as string;
  const noteId = Number(params.noteId);

  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<
    number | null
  >(null);

  const { data: note, isLoading } = api.note.getById.useQuery({ id: noteId });
  const downloadQuery = api.note.downloadAttachment.useQuery(
    { attachmentId: downloadingAttachmentId ?? -1 },
    {
      enabled: downloadingAttachmentId !== null,
      refetchOnWindowFocus: false,
    },
  );
  const handleDownload = useCallback((attachmentId: number) => {
    setDownloadingAttachmentId(attachmentId);
  }, []);

  const processDownload = useCallback(
    (data: { fileName: string; fileContent: string; mimeType: string }) => {
      try {
        const blob = new Blob([Buffer.from(data.fileContent, "base64")], {
          type: data.mimeType,
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast({
          title: "成功",
          description: "ファイルのダウンロードを開始しました。",
        });
      } catch (error) {
        toast({
          title: "エラー",
          description: "ファイルの処理中にエラーが発生しました。",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  useEffect(() => {
    if (downloadQuery.data && downloadingAttachmentId !== null) {
      processDownload(downloadQuery.data);
      setDownloadingAttachmentId(null);
    }
  }, [downloadQuery.data, downloadingAttachmentId, processDownload]);

  useEffect(() => {
    if (downloadQuery.error) {
      toast({
        title: "エラー",
        description: "ダウンロード中にエラーが発生しました。",
        variant: "destructive",
      });
      setDownloadingAttachmentId(null);
    }
  }, [downloadQuery.error, toast]);

  if (isLoading) {
    return <div className="text-center text-white">読み込み中...</div>;
  }

  if (!note) {
    return <div className="text-center text-white">メモが見つかりません</div>;
  }

  const handleEdit = () => {
    router.push(`/books/${isbn}/notes/${noteId}/edit`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            {note.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-200">内容:</h3>
            <p className="whitespace-pre-wrap text-gray-300">{note.content}</p>
          </div>
          {note.attachments.length > 0 && (
            <div>
              <ul>
                {note.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-200">
                      添付ファイル:
                    </h3>
                    <ul>
                      {note.attachments.map((attachment) => (
                        <li
                          key={attachment.id}
                          className="flex items-center mb-2"
                        >
                          <span className="mr-2 text-gray-300">
                            {attachment.fileName}
                          </span>
                          <Button
                            onClick={() => handleDownload(attachment.id)}
                            size="sm"
                            variant="secondary"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={
                              downloadQuery.isFetching &&
                              downloadingAttachmentId === attachment.id
                            }
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {downloadQuery.isFetching &&
                            downloadingAttachmentId === attachment.id
                              ? "ダウンロード中..."
                              : "ダウンロード"}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </ul>
            </div>
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
