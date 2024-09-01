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
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });
      await utils.book.getByIsbn.invalidate({ isbn });
      await refetch();
      router.push(`/books/${isbn}/notes/${noteId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = api.note.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "ノートを削除しました",
        description: "ノートとその添付ファイルが正常に削除されました。",
      });
      await utils.book.getByIsbn.invalidate({ isbn });
      router.push(`/books/${isbn}/notes`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const attachmentsToUpload = await Promise.all(
      newAttachments.map(async (file) => {
        const fileContent = await fileToBase64(file);
        return {
          fileName: file.name,
          fileContent,
          mimeType: file.type,
        };
      }),
    );

    updateNoteMutation.mutate({
      id: noteId,
      title,
      content,
      isPublic,
      attachments: attachmentsToUpload,
      removedAttachmentIds,
    });
  };

  const handleDelete = () => {
    deleteNoteMutation.mutate({ id: noteId });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments((prev) => [
        ...prev,
        ...Array.from(e.target.files || []),
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
