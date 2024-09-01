"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useBookDetail } from "~/hooks/useBookDetail";
import { BookDetailCard } from "~/app/_components/books/detail/BookDetailCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BookThreadList from "~/app/_components/books/thread/BookThreadList";

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
      <BookDetailCard
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
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本のステータスを解除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              本のステータスを解除すると、マイブックから削除されます。また、この本に関連するすべての読書メモも削除されます。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              解除して削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookDetail;
