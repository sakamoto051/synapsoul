import type { Attachment, Note } from "@prisma/client";

export type NoteWithBook = Note & {
  book: {
    user: {
      name: string | null;
      displayName: string | null;
    };
  };
} & {
  attachments: Attachment[];
};
