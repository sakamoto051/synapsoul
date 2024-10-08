"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBookDetail } from "~/hooks/useBookDetail";
import { BookInfo } from "~/app/_components/books/detail/BookInfo";
import { BookActions } from "~/app/_components/books/detail/BookActions";
import { ConfirmDialog } from "~/app/_components/books/detail/ConfirmDialog";
import BookThreadList from "~/app/_components/books/thread/BookThreadList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageCircle, Clock5, Users } from "lucide-react";
import Script from "next/script";
import Link from "next/link";
import type { BookItem } from "~/types/book";

const BookDetailClient = ({
  isbn,
  initialBook,
}: {
  isbn: string;
  initialBook: BookItem;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    book,
    currentStatus,
    isInMyBooks,
    isConfirmOpen,
    setIsConfirmOpen,
    handleStatusChange,
    confirmStatusChange,
  } = useBookDetail(isbn, initialBook);
  const [showThreads, setShowThreads] = useState(false);

  if (!book) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    isbn: book.isbn,
    name: book.title,
    author: { "@type": "Person", name: book.author },
    publisher: { "@type": "Organization", name: book.publisherName },
    datePublished: book.salesDate,
    description: book.itemCaption,
    image: book.largeImageUrl,
  };

  const handleBack = () => {
    const from = searchParams.get("from");
    if (from === "mybooks") {
      router.push("/books/mybooks");
    } else {
      const title = searchParams.get("title") ?? "";
      const author = searchParams.get("author") ?? "";
      const publisherName = searchParams.get("publisherName") ?? "";
      const booksGenreId = searchParams.get("booksGenreId") ?? "";
      const page = searchParams.get("page") ?? "1";

      const searchConditions = new URLSearchParams();
      if (title) searchConditions.append("title", title);
      if (author) searchConditions.append("author", author);
      if (publisherName)
        searchConditions.append("publisherName", publisherName);
      if (booksGenreId) searchConditions.append("booksGenreId", booksGenreId);
      if (page !== "1") searchConditions.append("page", page);

      const searchString = searchConditions.toString();
      router.push(`/books/search?${searchString}`);
    }
  };

  return (
    <>
      <Script
        id="structured-data-script"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>
      <div className="container mx-auto px-2 py-2 sm:px-4 sm:py-4">
        <Button
          onClick={handleBack}
          className="mb-2 bg-gray-700 text-white hover:bg-gray-600"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <BookInfo book={book} />
          </div>
          <div className="md:col-span-1">
            <BookActions
              book={book}
              currentStatus={currentStatus}
              isInMyBooks={isInMyBooks}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Link href={`/books/${isbn}/characters`} passHref className="block">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              <Users className="mr-2 h-4 w-4" />
              キャラクター管理
            </Button>
          </Link>
          <Link href={`/books/${isbn}/timelines`} passHref className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Clock5 className="mr-2 h-4 w-4" />
              タイムライン一覧
            </Button>
          </Link>
          <Button
            onClick={() => setShowThreads(!showThreads)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {showThreads ? "スレッド一覧を隠す" : "スレッド一覧を表示"}
          </Button>
        </div>
        {showThreads && (
          <div className="mt-3">
            <BookThreadList />
          </div>
        )}

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmStatusChange}
        />
      </div>
    </>
  );
};

export default BookDetailClient;
