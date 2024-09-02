"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
    <Card className="bg-gray-800 text-gray-100 border-none shadow-lg flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-gray-700">
      <Link href={`/books/${book.isbn}`} className="flex-grow">
        <CardHeader className="p-4">
          <Image
            src={book.largeImageUrl || "/api/placeholder/120/180"}
            alt={book.title || "Book cover"}
            width={200}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <h3 className="text-sm font-medium text-blue-300 line-clamp-2 mb-2">
            {book.title || "Unknown Title"}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1">
            {book.author || "Unknown Author"}
          </p>
        </CardContent>
      </Link>
      {showStatus && (
        <CardFooter className="p-4">
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
