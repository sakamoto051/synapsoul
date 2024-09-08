import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { BookItem } from "~/types/book";
import Link from "next/link";
// import Image from "next/image";

interface BookInfoProps {
  book: BookItem;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => (
  <Card className="bg-gray-800 text-gray-100 border-none shadow-lg">
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <div className="w-[150px] h-[225px] relative">
            {/* <Image
              src={book.largeImageUrl || "/api/placeholder/150/225"}
              alt={book.title || "Book cover"}
              fill={true}
              sizes="100%, 100%"
              className="object-contain rounded-md shadow-md"
              priority={true}
            /> */}
            <img
              src={book.largeImageUrl || "/api/placeholder/150/225"}
              alt={book.title || "Book cover"}
              className="object-contain rounded-md shadow-md"
            />
          </div>
        </div>
        <div className="flex-grow">
          <h1 className="text-xl font-bold text-blue-300 mb-2">{book.title}</h1>
          <p className="text-sm mb-1">
            <span className="text-blue-300">著者: </span>
            <Link
              href={`/books/search?author=${book.author}`}
              className="text-blue-400 hover:text-blue-400 underline"
            >
              {book.author}
            </Link>
          </p>
          <p className="text-sm mb-1">
            <span className="text-blue-300">出版社: </span>
            <Link
              href={`/books/search?publisherName=${book.publisherName}`}
              className="text-blue-400 hover:text-blue-400 underline"
            >
              {book.publisherName}
            </Link>
          </p>
          <p className="text-sm mb-1">
            <span className="text-blue-300">発売日: </span> {book.salesDate}
          </p>
          <p className="text-sm mb-1">
            <span className="text-blue-300">ISBN: </span> {book.isbn}
          </p>
          <p className="text-sm mb-2">
            <span className="text-blue-300">価格: </span> {book.itemPrice}円
          </p>
          <p className="text-xs text-gray-300 line-clamp-3">
            {book.itemCaption}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
