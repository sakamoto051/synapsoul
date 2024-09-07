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
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
    {books.map((book) => (
      <BookCard
        key={book.isbn}
        book={book}
        onStatusChange={onStatusChange}
        isInMyBooks={true}
        showStatus={true}
        size="small"
      />
    ))}
    {books.length === 0 && (
      <div className="col-span-full text-center py-6 text-gray-400">
        <p className="text-lg">条件に一致する本が見つかりません。</p>
        <p className="mt-2">
          検索条件を変更するか、新しい本を追加してください。
        </p>
        <p className="mt-2">
          ※反映まで数分かかる可能性があります。
        </p>
      </div>
    )}
  </div>
);
