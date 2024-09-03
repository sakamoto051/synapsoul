import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { NoteWithBook } from "~/types/note";

export const useBookNoteDetail = (isbn: string, noteId: number) => {
  const [note, setNote] = useState<NoteWithBook | null>(null);

  const { data } = api.note.getById.useQuery({
    id: noteId,
  });

  useEffect(() => {
    if (data) {
      setNote(data);
    }
  }, [data]);

  return {
    note,
  };
};
