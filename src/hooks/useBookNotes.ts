// src/hooks/useBookNotes.ts
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { Book, Note } from "@prisma/client";

export const useBookNotes = (isbn: string) => {
  const [book, setBook] = useState<(Book & { notes: Note[] }) | null>(null);

  const { data, refetch } = api.book.getByIsbn.useQuery({ isbn });

  useEffect(() => {
    setBook(data ?? null);
  }, [data]);

  const handleRefetch = async () => {
    await refetch();
  };

  return { book, handleRefetch };
};
