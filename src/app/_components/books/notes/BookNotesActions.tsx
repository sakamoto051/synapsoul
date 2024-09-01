// src/app/_components/books/notes/BookNotesActions.tsx
import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";

interface BookNotesActionsProps {
  isbn: string;
}

export const BookNotesActions: React.FC<BookNotesActionsProps> = ({ isbn }) => (
  <div className="mt-6 flex justify-between">
    <Link href={`/books/${isbn}`} passHref>
      <Button className="bg-gray-700 text-white hover:bg-gray-600">
        <ChevronLeft className="mr-2 h-4 w-4" />
        書籍詳細に戻る
      </Button>
    </Link>
    <Link href={`/books/${isbn}/notes/create`} passHref>
      <Button className="bg-green-600 text-white hover:bg-green-700">
        <Plus className="mr-2 h-4 w-4" />
        新しい読書メモ
      </Button>
    </Link>
  </div>
);
