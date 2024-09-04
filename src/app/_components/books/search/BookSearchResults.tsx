import type React from "react";
import type { BookItem, BookWithDetails } from "~/types/book";
import BookCard from "~/app/_components/books/BookCard";
import BookListItem from "~/app/_components/books/search/BookListItem";

interface BookSearchResultsProps {
  books: BookItem[];
  view: "grid" | "list";
}

export const BookSearchResults: React.FC<BookSearchResultsProps> = ({
  books,
  view,
}) => (
  <div
    className={
      view === "grid" ? "flex flex-wrap justify-center gap-3" : "space-y-4"
    }
  >
    {books.map((book: BookItem) =>
      view === "grid" ? (
        <BookCard
          key={book.isbn}
          book={book as BookWithDetails}
          onStatusChange={() => ({})}
          isInMyBooks={false}
          showStatus={false}
        />
      ) : (
        <BookListItem key={book.isbn} book={book as BookWithDetails} />
      ),
    )}
    {books.length === 0 && (
      <p className="w-full text-center text-gray-400 mt-4">
        条件に一致する本が見つかりませんでした。 別の単語で検索してみてください。
      </p>
    )}
  </div>
);
