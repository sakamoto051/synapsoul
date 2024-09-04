"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookStatusDropdown } from "~/app/_components/books/BookStatusDropDown";
import type { BookWithDetails } from "~/types/book";
import type { BookStatus } from "@prisma/client";

interface BookCardProps {
  book: BookWithDetails;
  onStatusChange: (book: BookWithDetails, newStatus: BookStatus | null) => void;
  isInMyBooks: boolean;
  showStatus?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onStatusChange,
  isInMyBooks,
  showStatus = true,
}) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-none shadow-lg flex flex-col h-[220px] w-[120px] transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-gray-800">
      <Link href={`/books/${book.isbn}`} className="flex-grow">
        <div className="pt-2 h-[150px] flex items-center justify-center">
          <Image
            src={book.largeImageUrl || "/api/placeholder/100/150"}
            alt={book.title || "Book cover"}
            width={100}
            height={150}
            className="object-contain max-h-full"
          />
        </div>
        <CardContent className="p-2 h-[60px] overflow-hidden">
          <h3 className="text-xs font-medium text-blue-300 line-clamp-2 mb-1">
            {book.title || "Unknown Title"}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1">
            {book.author || "Unknown Author"}
          </p>
        </CardContent>
      </Link>
      {showStatus && (
        <CardFooter className="p-1">
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
