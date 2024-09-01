// src/app/_components/books/search/BookSearchResults.tsx
import type React from "react";
import type { BookItem, BookWithDetails } from "~/types/book";
import BookCard from "~/app/_components/books/BookCard";

interface BookSearchResultsProps {
  books: BookItem[];
}

export const BookSearchResults: React.FC<BookSearchResultsProps> = ({
  books,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {books.map((book: BookItem) => (
      <BookCard
        key={book.isbn}
        book={book as BookWithDetails}
        onStatusChange={() => ({})}
        isInMyBooks={false}
        showStatus={false}
      />
    ))}
  </div>
);
