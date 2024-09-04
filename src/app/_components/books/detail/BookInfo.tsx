import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { BookItem } from "~/types/book";
import Image from "next/image";

interface BookInfoProps {
  book: BookItem;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => (
  <Card className="bg-gray-800 text-gray-100 border-none shadow-lg">
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <Image
            src={book.largeImageUrl || "/api/placeholder/150/225"}
            alt={book.title || "Book cover"}
            width={150}
            height={225}
            className="object-contain rounded-md shadow-md"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-xl font-bold text-blue-300 mb-2">{book.title}</h1>
          <p className="text-sm mb-1">
            <span className="text-blue-300">著者:</span> {book.author}
          </p>
          <p className="text-sm mb-1">
            <span className="text-blue-300">出版社:</span> {book.publisherName}
          </p>
          <p className="text-sm mb-1">
            <span className="text-blue-300">発売日:</span> {book.salesDate}
          </p>
          <p className="text-sm mb-1">
            <span className="text-blue-300">ISBN:</span> {book.isbn}
          </p>
          <p className="text-sm mb-2">
            <span className="text-blue-300">価格:</span> {book.itemPrice}円
          </p>
          <p className="text-xs text-gray-300 line-clamp-3">
            {book.itemCaption}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
