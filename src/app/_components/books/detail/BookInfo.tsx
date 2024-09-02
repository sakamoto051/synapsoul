// src/app/_components/books/detail/BookInfo.tsx
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookItem } from "~/types/book";
import Image from 'next/image';

interface BookInfoProps {
  book: BookItem;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => (
  <Card className="bg-gray-800 text-gray-100 border-none shadow-lg mb-6">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-blue-300">
        {book.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={book.largeImageUrl || ""}
          alt={book.title || "Book cover"}
          width={200}
          height={200}
          className="object-cover rounded-md shadow-md"
        />
        <div className="flex-1">
          <p>
            <strong className="text-blue-300">著者:</strong> {book.author}
          </p>
          <p>
            <strong className="text-blue-300">出版社:</strong>{" "}
            {book.publisherName}
          </p>
          <p>
            <strong className="text-blue-300">発売日:</strong> {book.salesDate}
          </p>
          <p>
            <strong className="text-blue-300">ISBN:</strong> {book.isbn}
          </p>
          <p>
            <strong className="text-blue-300">価格:</strong> {book.itemPrice}円
          </p>
          <p className="mt-4 text-gray-300">{book.itemCaption}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
