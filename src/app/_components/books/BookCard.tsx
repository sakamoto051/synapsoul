import type React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BookStatusDropdown } from "~/app/_components/books/BookStatusDropDown";
import type { BookWithDetails, BookStatus } from "~/types/book";

interface BookCardProps {
  book: BookWithDetails;
  onStatusChange?: (
    book: BookWithDetails,
    newStatus: BookStatus | null,
  ) => void;
  isInMyBooks: boolean;
  showStatus?: boolean;
  size?: "small" | "large";
  searchTerm?: string;
  authorInput?: string;
  publisherInput?: string;
  genreInput?: string;
  currentPage?: number;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onStatusChange,
  isInMyBooks,
  showStatus = true,
  size = "small",
  searchTerm,
  authorInput,
  publisherInput,
  genreInput,
  currentPage,
}) => {
  const isLarge = size === "large";
  const showStatusDropdown = showStatus && onStatusChange;

  return (
    <Card className="flex flex-col bg-gray-900 text-gray-100 border-none shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:bg-gray-800">
      <Link
        href={`/books/${book.isbn}?from=${isInMyBooks ? "mybooks" : "search"}&title=${searchTerm}&author=${authorInput}&publisherName=${publisherInput}&booksGenreId=${genreInput}&page=${currentPage}`}
        className="flex-grow flex flex-col p-2 w-32"
      >
        <div
          className={`flex items-center justify-center ${isLarge ? "h-48" : "h-40"}`}
        >
          <img
            src={book.largeImageUrl || "/api/placeholder/100/150"}
            alt={book.title || "Book cover"}
            className="object-contain max-h-full max-w-full"
          />
        </div>
        <div className="flex-grow flex flex-col justify-between mt-2">
          <h3
            className={`font-medium text-blue-300"truncate" ${isLarge ? "text-sm" : "text-xs"} leading-tight line-clamp-2`}
          >
            {book.title || "Unknown Title"}
          </h3>
          <p
            className={`text-gray-400 truncate ${isLarge ? "text-xs" : "text-[10px]"} mt-1`}
          >
            {book.author || "Unknown Author"}
          </p>
        </div>
      </Link>
      {showStatusDropdown && (
        <div className="p-2 mt-auto">
          <BookStatusDropdown
            currentStatus={book.status}
            onStatusChange={(newStatus) => onStatusChange(book, newStatus)}
            isInMyBooks={isInMyBooks}
          />
        </div>
      )}
    </Card>
  );
};

export default BookCard;
