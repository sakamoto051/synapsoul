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
      const uploadedAttachments = await Promise.all(
        newAttachments.map(async (file) => {
          const url = await handleFileUpload(file);
          return {
            fileName: file.name,
            filePath: url,
            mimeType: file.type,
            fileContent: "", // Add the fileContent property
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

  const removeExistingAttachment = (id: number) => {
    setExistingAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== id),
    );
    setRemovedAttachmentIds((prev) => [...prev, id]);
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
    handleFileChange,
    removeNewAttachment,
    removeExistingAttachment,
  };
};
