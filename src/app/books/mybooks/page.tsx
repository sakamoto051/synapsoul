// src/app/books/mybooks/page.tsx
"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import type { BookStatus } from "@prisma/client";
import type { BookWithDetails } from "~/types/book";
import { MyBooksFilter } from "~/app/_components/books/mybooks/MyBooksFilter";
import { MyBooksList } from "~/app/_components/books/mybooks/MyBooksList";

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
      <MyBooksFilter
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchTermChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />
      <MyBooksList books={filteredBooks} />
    </div>
  );
};

export default MyBooksPage;
