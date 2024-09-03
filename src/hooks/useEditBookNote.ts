// src/hooks/useEditBookNote.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import type { Attachment } from "@prisma/client";

export const useEditBookNote = (isbn: string, noteId: number) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(
    [],
  );
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>(
    [],
  );

  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useContext();

  const { data: note, refetch } = api.note.getById.useQuery({ id: noteId });

  const updateNoteMutation = api.note.update.useMutation({
    onSuccess: async () => {
      await utils.book.getByIsbn.invalidate({ isbn });
      await refetch();
    },
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsPublic(note.isPublic);
      setExistingAttachments(note.attachments);
    }
  }, [note]);

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response: Response = await fetch(
      `/api/upload?filename=${encodeURIComponent(file.name)}`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { url: string };

    if (!data || typeof data.url !== "string") {
      throw new Error("Invalid response from server");
    }

    return data.url;
  };

  const handleFileDelete = async (url: string): Promise<void> => {
    const response = await fetch("/api/delete-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) {
      toast({
        title: "エラー",
        description: "ノート情報が見つかりません。",
        variant: "destructive",
      });
      return;
    }

    try {
      // 削除されたファイルの処理
      await Promise.all(
        removedAttachmentIds.map(async (id) => {
          const attachment = note.attachments.find((a) => a.id === id);
          if (attachment) {
            await handleFileDelete(attachment.filePath);
          }
        }),
      );

      // 新しいファイルのアップロード
      const uploadedAttachments = await Promise.all(
        newAttachments.map(async (file) => {
          const url = await handleFileUpload(file);
          return {
            fileName: file.name,
            filePath: url,
            mimeType: file.type,
          };
        }),
      );

      await updateNoteMutation.mutateAsync({
        id: noteId,
        title,
        content,
        isPublic,
        attachments: uploadedAttachments,
        removedAttachmentIds,
      });

      toast({
        title: "ノートが更新されました",
        description: "ノートの更新が完了しました。",
      });
      router.push(`/books/${isbn}/notes/${noteId}`);
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "エラー",
        description: "ノートの更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments((prev) => [
        ...prev,
        ...Array.from(e.target.files ?? []),
      ]);
    }
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = async (id: number) => {
    const attachmentToRemove = existingAttachments.find((a) => a.id === id);
    if (attachmentToRemove) {
      try {
        await handleFileDelete(attachmentToRemove.filePath);
        setExistingAttachments((prev) =>
          prev.filter((attachment) => attachment.id !== id),
        );
        setRemovedAttachmentIds((prev) => [...prev, id]);
      } catch (error) {
        console.error("Error removing attachment:", error);
        toast({
          title: "エラー",
          description: "添付ファイルの削除中にエラーが発生しました。",
          variant: "destructive",
        });
      }
    }
  };

  const deleteNoteMutation = api.note.delete.useMutation({
    onSuccess: async () => {
      await utils.book.getByIsbn.invalidate({ isbn });
    },
  });

  const handleDelete = async () => {
    if (!note) {
      toast({
        title: "エラー",
        description: "ノート情報が見つかりません。",
        variant: "destructive",
      });
      return;
    }

    try {
      // 全ての添付ファイルを削除
      await Promise.all(
        note.attachments.map(async (attachment) => {
          await handleFileDelete(attachment.filePath);
        }),
      );

      await deleteNoteMutation.mutateAsync({ id: noteId });

      toast({
        title: "ノートを削除しました",
        description: "ノートとその添付ファイルが正常に削除されました。",
      });
      router.push(`/books/${isbn}/notes`);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "エラー",
        description: "ノートの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isPublic,
    setIsPublic,
    existingAttachments,
    newAttachments,
    handleSubmit,
    handleDelete,
    handleFileChange,
    removeNewAttachment,
    removeExistingAttachment,
  };
};
