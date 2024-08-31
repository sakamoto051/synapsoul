// src/components/BookDetailCard.tsx
import type React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Users, ShoppingCart } from "lucide-react";
import type { BookItem } from "~/types/book";
import { BookStatusDropdown } from "~/app/_components/books/book-status-dropdown";
import type { BookStatus } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface BookDetailCardProps {
  book: BookItem;
  currentStatus: BookStatus | null;
  isInMyBooks: boolean;
  onStatusChange: (status: BookStatus | null) => void;
}

export const BookDetailCard: React.FC<BookDetailCardProps> = ({
  book,
  currentStatus,
  isInMyBooks,
  onStatusChange,
}) => (
  <Card className="bg-gray-800 text-gray-100 border-none shadow-lg">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-blue-300">
        {book.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.largeImageUrl}
          alt={book.title}
          className="w-48 h-auto object-cover rounded-md shadow-md"
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
          <div className="mt-6">
            <BookStatusDropdown
              currentStatus={currentStatus}
              onStatusChange={onStatusChange}
              isInMyBooks={isInMyBooks}
            />
            {currentStatus === null && (
              <Alert
                variant="default"
                className="bg-blue-900 border-blue-700 mt-1 text-white"
              >
                <Info className="h-4 w-4" />
                <AlertDescription>
                  この本にはまだステータスが設定されていません。ステータスを設定すると、マイブックに追加されます。
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="mt-6 space-x-2">
            <Link href={`/books/${book.isbn}/notes`} passHref>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <BookText className="mr-2 h-4 w-4" />
                読書メモ
              </Button>
            </Link>
            <Link href={`/books/${book.isbn}/public-notes`} passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="mr-2 h-4 w-4" />
                公開メモを見る
              </Button>
            </Link>
            <Link href={book.affiliateUrl} passHref>
              <Button className="bg-teal-600 bg-red-600 hover:bg-red-700 text-white">
                <ShoppingCart className="mr-2 h-4 w-4" />
                楽天で購入
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
