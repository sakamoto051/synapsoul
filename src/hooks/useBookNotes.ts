// src/hooks/useBookNotes.ts
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { Book, Note } from "@prisma/client";

export const useBookNotes = (isbn: string) => {
  const [book, setBook] = useState<(Book & { notes: Note[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch,
  } = api.book.getByIsbn.useQuery({ isbn });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (fetchError) {
      setError("読書メモの取得中にエラーが発生しました。");
      setLoading(false);
    } else if (data) {
      setBook(data);
      setLoading(false);
      setError(null);
    }
  }, [data, isLoading, fetchError]);

  const handleRefetch = async () => {
    setLoading(true);
    setError(null);
    await refetch();
  };

  return { book, loading, error, handleRefetch };
};
