// src/app/_components/books/mybooks/MyBooksList.tsx
import type React from "react";
import type { BookWithDetails } from "~/types/book";
import BookCard from "~/app/_components/books/BookCard";
import type { BookStatus } from "@prisma/client";

interface MyBooksListProps {
  books: BookWithDetails[];
  onStatusChange: (book: BookWithDetails, newStatus: BookStatus | null) => void;
}

export const MyBooksList: React.FC<MyBooksListProps> = ({
  books,
  onStatusChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {books.map((book) => (
      <BookCard
        key={book.isbn}
        book={book}
        onStatusChange={onStatusChange}
        isInMyBooks={true}
      />
    ))}
    {books.length === 0 && (
      <p className="text-center text-gray-400 mt-4 col-span-full">
        条件に一致する本が見つかりません。
      </p>
    )}
  </div>
);
