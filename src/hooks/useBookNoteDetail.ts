// src/hooks/useBookNoteDetail.ts
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import type { Note, Attachment } from "@prisma/client";

export const useBookNoteDetail = (isbn: string, noteId: number) => {
  const [note, setNote] = useState<
    (Note & { attachments: Attachment[] }) | null
  >(null);
  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<
    number | null
  >(null);
  const router = useRouter();
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = api.note.getById.useQuery({
    id: noteId,
  });
  const downloadQuery = api.note.downloadAttachment.useQuery(
    { attachmentId: downloadingAttachmentId ?? -1 },
    {
      enabled: downloadingAttachmentId !== null,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (data) {
      setNote(data);
    }
  }, [data]);

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

  const handleEdit = () => {
    router.push(`/books/${isbn}/notes/${noteId}/edit`);
  };

  return {
    note,
    isLoading,
    error,
    handleDownload,
    handleEdit,
    downloadQuery,
    downloadingAttachmentId,
  };
};
