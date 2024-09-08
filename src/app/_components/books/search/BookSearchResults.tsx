import type React from "react";
import type { BookItem, BookWithDetails } from "~/types/book";
import BookCard from "~/app/_components/books/BookCard";
import Image from "next/image";
import Link from "next/link";

interface BookSearchResultsProps {
  books: BookItem[];
  view: "grid" | "list";
  searchTerm: string;
  authorInput: string;
  publisherInput: string;
  genreInput: string;
  currentPage: number;
}

export const BookSearchResults: React.FC<BookSearchResultsProps> = ({
  books,
  view,
  searchTerm,
  authorInput,
  publisherInput,
  genreInput,
  currentPage,
}) => (
  <div
    className={
      view === "grid"
        ? "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2"
        : "space-y-2"
    }
  >
    {books.map((book) =>
      view === "grid" ? (
        <BookCard
          key={book.isbn}
          book={book as BookWithDetails}
          isInMyBooks={false}
          showStatus={false}
          size="small"
          searchTerm={searchTerm}
          authorInput={authorInput}
          publisherInput={publisherInput}
          genreInput={genreInput}
          currentPage={currentPage}
        />
      ) : (
        <div
          key={book.isbn}
          className="flex bg-gray-800 p-3 rounded-lg shadow-md"
        >
          <div className="flex-shrink-0 w-16 h-24">
            <Image
              src={book.largeImageUrl || "/api/placeholder/64/96"}
              alt={book.title || "Book cover"}
              width={64}
              height={96}
              className="object-cover"
            />
          </div>
          <div className="ml-3 flex flex-col justify-between flex-grow">
            <div>
              <Link
                href={`/books/${book.isbn}?from=search&title=${searchTerm}&author=${authorInput}&publisherName=${publisherInput}&booksGenreId=${genreInput}&page=${currentPage}`}
                className="text-blue-300 hover:text-blue-200 font-medium text-sm"
              >
                {book.title || "Unknown Title"}
              </Link>
              <p className="text-xs text-gray-400">
                {book.author || "Unknown Author"}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <p>ISBN: {book.isbn}</p>
              <p>出版日: {book.salesDate}</p>
            </div>
          </div>
        </div>
      ),
    )}
    {books.length === 0 && (
      <p className="col-span-full text-center text-gray-400 mt-4">
        該当する書籍が見つかりませんでした。検索条件を変更してお試しください。
      </p>
    )}
  </div>
);
