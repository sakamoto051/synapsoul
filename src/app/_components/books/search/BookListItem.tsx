import type React from "react";
import Image from "next/image";
import Link from "next/link";
import type { BookWithDetails } from "~/types/book";

interface BookListItemProps {
  book: BookWithDetails;
}

const BookListItem: React.FC<BookListItemProps> = ({ book }) => {
  return (
    <div className="flex bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex-shrink-0 w-20 h-30">
        <Image
          src={book.largeImageUrl || "/api/placeholder/80/120"}
          alt={book.title || "Book cover"}
          width={80}
          height={120}
          className="object-cover"
        />
      </div>
      <div className="ml-4 flex flex-col justify-between">
        <div>
          <Link
            href={`/books/${book.isbn}`}
            className="text-blue-300 hover:text-blue-200 font-medium"
          >
            {book.title || "Unknown Title"}
          </Link>
          <p className="text-sm text-gray-400">
            {book.author || "Unknown Author"}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          <p>ISBN: {book.isbn}</p>
          <p>Published: {book.salesDate}</p>
        </div>
      </div>
    </div>
  );
};

export default BookListItem;
