import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookStatusDropdown } from "~/app/_components/books/BookStatusDropDown";
import type { BookWithDetails } from "~/types/book";
import type { BookStatus } from "@prisma/client";

interface BookCardProps {
  book: BookWithDetails;
  onStatusChange?: (
    book: BookWithDetails,
    newStatus: BookStatus | null,
  ) => void;
  isInMyBooks: boolean;
  showStatus?: boolean;
  size?: "small" | "large";
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onStatusChange,
  isInMyBooks,
  showStatus = true,
  size = "small",
}) => {
  const isLarge = size === "large";
  const showStatusDropdown = showStatus && onStatusChange;

  return (
    <Card
      className={`
        bg-gray-900 text-gray-100 border-none shadow-lg flex flex-col 
        transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-gray-800 
        w-full
        ${
          isLarge
            ? showStatusDropdown
              ? "h-[320px]"
              : "h-[280px]"
            : showStatusDropdown
              ? "h-[240px]"
              : "h-[200px]"
        }
      `}
    >
      <Link href={`/books/${book.isbn}`} className="flex-grow flex flex-col">
        <div
          className={`pt-2 ${isLarge ? "h-[180px]" : "h-[140px]"} flex items-center justify-center`}
        >
          <Image
            src={book.largeImageUrl || "/api/placeholder/120/180"}
            alt={book.title || "Book cover"}
            width={isLarge ? 120 : 80}
            height={isLarge ? 180 : 120}
            className="object-contain max-h-full"
          />
        </div>
        <CardContent className="p-2 flex-grow flex flex-col justify-between">
          <h3
            className={`font-medium text-blue-300 line-clamp-2 ${isLarge ? "text-sm" : "text-xs"}`}
          >
            {book.title || "Unknown Title"}
          </h3>
          <p
            className={`text-gray-400 line-clamp-1 ${isLarge ? "text-xs" : "text-[10px]"}`}
          >
            {book.author || "Unknown Author"}
          </p>
        </CardContent>
      </Link>
      {showStatusDropdown && (
        <CardFooter className="p-2 mt-auto">
          <BookStatusDropdown
            currentStatus={book.status}
            onStatusChange={(newStatus) => onStatusChange(book, newStatus)}
            isInMyBooks={isInMyBooks}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default BookCard;
