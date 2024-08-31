// src/components/BookList.tsx
import type React from "react";
import Link from "next/link";
import type { BookItem } from "~/types/book";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface BookListProps {
  books: BookItem[];
  currentPage: number;
  searchTerm: string;
  authorInput: string;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  currentPage,
  searchTerm,
  authorInput,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {books.map((book: BookItem) => (
      <Link
        key={book.isbn}
        href={`/books/${book.isbn}?title=${encodeURIComponent(searchTerm)}&author=${encodeURIComponent(authorInput)}&page=${currentPage}`}
        className="block"
      >
        <Card className="bg-gray-800 text-gray-100 border-none shadow-lg flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:bg-gray-700 cursor-pointer">
          <CardHeader className="p-2">
            <img
              src={book.largeImageUrl}
              alt={book.title}
              className="w-full h-auto rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="flex-grow">
            <h3 className="text-sm font-semibold text-center truncate">
              {book.title}
            </h3>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-400 text-center truncate w-full">
              {book.author}
            </p>
          </CardFooter>
        </Card>
      </Link>
    ))}
  </div>
);

export default BookList;
