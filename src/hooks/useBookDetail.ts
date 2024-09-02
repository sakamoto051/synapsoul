// src/hooks/useBookDetail.ts
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { BookItem, BookResponse } from "~/types/book";
import type { BookStatus } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

export const useBookDetail = (isbn: string) => {
  const [book, setBook] = useState<BookItem | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateStatusMutation = api.book.updateStatus.useMutation();
  const { toast } = useToast();

  const [currentStatus, setCurrentStatus] = useState<BookStatus | null>(null);
  const [isInMyBooks, setIsInMyBooks] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<BookStatus | null>(null);

  const { data: initialStatus, refetch: refetchStatus } =
    api.book.getStatus.useQuery({ isbn });

  const fetchBookDetail = useCallback(async () => {
    if (!isbn) return;

    try {
      const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as BookResponse;
      if (data.Items && data.Items.length > 0) {
        const item = data.Items[0]?.Item;
        if (item) {
          setBook(item);
        }
      } else {
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  }, [isbn]);

  useEffect(() => {
    void fetchBookDetail();
  }, [fetchBookDetail]);

  useEffect(() => {
    if (initialStatus !== undefined) {
      setCurrentStatus(initialStatus);
      setIsInMyBooks(initialStatus !== null);
    }
  }, [initialStatus]);

  const handleBack = () => {
    const title = searchParams.get("title") ?? "";
    const author = searchParams.get("author") ?? "";
    const page = searchParams.get("page") ?? "1";

    const searchConditions = new URLSearchParams();
    if (title) searchConditions.append("title", title);
    if (author) searchConditions.append("author", author);
    if (page !== "1") searchConditions.append("page", page);

    const searchString = searchConditions.toString();
    router.push(`/books/search?${searchString}`);
  };

  const updateBookStatus = async (status: BookStatus | null) => {
    if (!book) return;

    try {
      await updateStatusMutation.mutateAsync({
        isbn: book?.isbn ?? "",
        status: status,
      });
      await refetchStatus();

      setCurrentStatus(status);
      setIsInMyBooks(status !== null);

      if (status === null) {
        toast({
          title: "ステータス解除",
          description:
            "本のステータスを解除し、マイブックから削除しました。関連する読書メモも削除されました。",
        });
      } else {
        toast({
          title: "ステータス更新",
          description: `本のステータスを "${status}" に更新しました。`,
        });
      }
    } catch (error) {
      console.error("Error updating book status:", error);
      toast({
        title: "エラー",
        description: "本のステータス更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: BookStatus | null) => {
    if (newStatus === null && isInMyBooks) {
      setPendingStatus(null);
      setIsConfirmOpen(true);
    } else {
      await updateBookStatus(newStatus);
    }
  };

  const confirmStatusChange = async () => {
    setIsConfirmOpen(false);
    await updateBookStatus(pendingStatus);
  };

  const handleRetry = async () => {
    await refetchStatus();
    await fetchBookDetail();
  };

  return {
    book,
    currentStatus,
    isInMyBooks,
    isConfirmOpen,
    setIsConfirmOpen,
    handleBack,
    handleStatusChange,
    confirmStatusChange,
    handleRetry,
  };
};
