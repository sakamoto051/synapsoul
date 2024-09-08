import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { BookStatus } from "@prisma/client";
import type { BookWithDetails } from "~/types/book";
import { useToast } from "@/components/ui/use-toast";

export const useMyBooks = () => {
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookStatus | "ALL">("ALL");
  const { data: userBooks, refetch } = api.book.getUserBooks.useQuery();
  const { toast } = useToast();

  const utils = api.useUtils();
  const updateStatusMutation = api.book.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      utils.book.getUserBooks.invalidate();
    },
  });

  useEffect(() => {
    if (userBooks) {
      setBooks(
        userBooks.filter((book): book is BookWithDetails => book !== undefined),
      );
    }
  }, [userBooks]);

  const handleStatusChange = async (
    book: BookWithDetails,
    newStatus: BookStatus | null,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        isbn: book.isbn,
        status: newStatus,
      });
      toast({
        title: "ステータス更新",
        description: newStatus
          ? `"${book.title}" のステータスを "${newStatus}" に更新しました。`
          : `"${book.title}" をマイブックから削除しました。`,
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "ステータスの更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const filteredBooks = books.filter(
    (book: BookWithDetails) =>
      (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "ALL" || book.status === statusFilter),
  );

  return {
    books: filteredBooks,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    handleStatusChange,
  };
};
