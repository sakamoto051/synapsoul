// src/components/NoteList.tsx
import type React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Globe, Lock } from "lucide-react";
import type { Note } from "@prisma/client";

interface NoteListProps {
  notes: Note[];
  isbn: string;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, isbn }) => (
  <>
    {notes.map((note) => (
      <Link href={`/books/${isbn}/notes/${note.id}`} key={note.id} passHref>
        <Card className="mb-4 bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-200">
                {note.title}
              </h3>
              <Badge
                variant={note.isPublic ? "default" : "secondary"}
                className="ml-2"
              >
                {note.isPublic ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    公開
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    非公開
                  </>
                )}
              </Badge>
            </div>
            <p className="text-gray-300 text-sm mt-2">
              作成日: {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </Link>
    ))}
  </>
);
