// src/app/books/[isbn]/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useBookDetail } from "~/hooks/useBookDetail";
import { BookInfo } from "~/app/_components/books/detail/BookInfo";
import { BookActions } from "~/app/_components/books/detail/BookActions";
import { ConfirmDialog } from "~/app/_components/books/detail/ConfirmDialog";
import BookThreadList from "~/app/_components/books/thread/BookThreadList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BookDetail = () => {
  const params = useParams();
  const isbn = params.isbn as string;
  const {
    book,
    currentStatus,
    isInMyBooks,
    isConfirmOpen,
    setIsConfirmOpen,
    handleBack,
    handleStatusChange,
    confirmStatusChange,
  } = useBookDetail(isbn);

  if (!book) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookInfo book={book} />
      <BookActions
        book={book}
        currentStatus={currentStatus}
        isInMyBooks={isInMyBooks}
        onStatusChange={handleStatusChange}
      />
      <BookThreadList />
      <div className="mt-8 text-center">
        <Button
          onClick={handleBack}
          className="bg-gray-700 text-white hover:bg-gray-600"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
      </div>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
};

export default BookDetail;
