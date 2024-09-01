// src/hooks/useBookNotes.ts
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { Book, Note } from "@prisma/client";

export const useBookNotes = (isbn: string) => {
  const [book, setBook] = useState<(Book & { notes: Note[] }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    error: fetchError,
    refetch,
  } = api.book.getByIsbn.useQuery({ isbn });

  useEffect(() => {
    setBook(data ?? null);
    setError(null);
  }, [data]);

  const handleRefetch = async () => {
    setError(null);
    await refetch();
  };

  return { book, error, handleRefetch };
};
