// src/hooks/useCreateBookNote.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";

export const useCreateBookNote = (isbn: string) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const utils = api.useContext();
  const {
    data: book,
    isLoading,
    error,
  } = api.book.getByIsbn.useQuery({ isbn });
  const createNoteMutation = api.note.create.useMutation({
    onSuccess: () => {
      utils.book.getByIsbn.invalidate({ isbn });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) {
      toast({
        title: "エラー",
        description: "書籍情報が見つかりません。",
        variant: "destructive",
      });
      return;
    }
    try {
      await createNoteMutation.mutateAsync({
        bookId: book.id,
        title,
        content,
        isPublic,
      });
      toast({
        title: "読書メモを作成しました",
        description: "新しい読書メモが正常に作成されました。",
      });
      router.push(`/books/${isbn}/notes`);
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "エラー",
        description: "読書メモの作成中にエラーが発生しました。",
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
    isLoading,
    error,
    handleSubmit,
  };
};
