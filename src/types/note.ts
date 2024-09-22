// src/types/note.ts
import type {
  Note as PrismaNote,
  Attachment as PrismaAttachment,
} from "@prisma/client";

export type Note = PrismaNote;
export type Attachment = PrismaAttachment;

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
