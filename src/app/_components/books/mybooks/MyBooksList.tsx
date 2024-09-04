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
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {books.map((book) => (
      <BookCard
        key={book.isbn}
        book={book}
        onStatusChange={onStatusChange}
        isInMyBooks={true}
        showStatus={true}
        size="large"
      />
    ))}
    {books.length === 0 && (
      <div className="col-span-full text-center py-10 text-gray-400">
        <p className="text-lg">条件に一致する本が見つかりません。</p>
        <p className="mt-2">
          検索条件を変更するか、新しい本を追加してください。
        </p>
      </div>
    )}
  </div>
);
