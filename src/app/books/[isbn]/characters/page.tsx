// src/app/books/[isbn]/characters/page.tsx
"use client";

import { useParams } from "next/navigation";
import CharacterManagement from "~/app/_components/books/characters/CharacterManagement";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CharacterManagementPage() {
  const params = useParams();
  const isbn = params.isbn as string;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-100">
      <Link href={`/books/${isbn}`} passHref>
        <Button className="mb-4 bg-gray-800 text-gray-100 hover:bg-gray-700">
          <ChevronLeft className="mr-2 h-4 w-4" />
          書籍詳細に戻る
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        キャラクター管理
      </h1>
      <CharacterManagement isbn={isbn} />
    </div>
  );
}
