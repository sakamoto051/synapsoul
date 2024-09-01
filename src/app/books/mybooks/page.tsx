"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookStatus } from "@prisma/client";
import type { BookWithDetails } from "~/types/book";
import BookCard from "~/app/_components/books/BookCard";
import { bookStatusConfig } from "~/config/bookStatus";

const MyBooksPage = () => {
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookStatus | "ALL">("ALL");
  const { data: userBooks } = api.book.getUserBooks.useQuery();

  useEffect(() => {
    if (userBooks) {
      setBooks(
        userBooks.filter((book): book is BookWithDetails => book !== undefined),
      );
    }
  }, [userBooks]);

  const filteredBooks = books.filter(
    (book: BookWithDetails) =>
      (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "ALL" || book.status === statusFilter),
  );

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-300">マイブックス</h1>

      <div className="flex mb-4 gap-2">
        <Input
          type="text"
          placeholder="本を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
        />
        <Select
          onValueChange={(value) =>
            setStatusFilter(value as BookStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[180px] bg-gray-800 text-gray-100 border-gray-700">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
            <SelectItem value="ALL">すべて</SelectItem>
            {Object.entries(bookStatusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                {config.icon} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.isbn}
            book={book}
            onStatusChange={() => {}}
            isInMyBooks={true}
          />
        ))}
      </div>
      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          条件に一致する本が見つかりません。
        </p>
      )}
    </div>
  );
};

export default MyBooksPage;
