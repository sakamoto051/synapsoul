import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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
  bg-gray-900 text-gray-100 border-none shadow-sm hover:shadow-md
  transition-all duration-300 ease-in-out hover:bg-gray-800 
  w-full h-full flex flex-col
`}
    >
      <Link
        href={`/books/${book.isbn}`}
        className="flex-grow flex flex-col p-2"
      >
        <div
          className={`${isLarge ? "h-[160px]" : "h-[120px]"} flex items-center justify-center`}
        >
          <Image
            src={book.largeImageUrl || "/api/placeholder/100/150"}
            alt={book.title || "Book cover"}
            width={isLarge ? 100 : 80}
            height={isLarge ? 150 : 120}
            className="object-contain w-auto h-auto"
          />
        </div>
        <div className="flex-grow flex flex-col justify-between mt-2">
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
