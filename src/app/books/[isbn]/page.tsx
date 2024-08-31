// src/app/books/[isbn]/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useBookDetail } from "~/hooks/useBookDetail";
import { BookDetailCard } from "~/app/_components/books/detail/BookDetailCard";
import BookThreadList from "~/app/_components/books/thread-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Card, CardContent } from "@/components/ui/card";

const BookDetail = () => {
  const params = useParams();
  const isbn = params.isbn as string;
  const {
    book,
    loading,
    error,
    currentStatus,
    isInMyBooks,
    isConfirmOpen,
    setIsConfirmOpen,
    handleBack,
    handleStatusChange,
    confirmStatusChange,
    handleRetry,
  } = useBookDetail(isbn);

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 bg-gray-800 text-gray-100 border-none shadow-lg">
        <CardContent>
          <div className="flex space-x-4">
            <Skeleton className="h-48 w-32 bg-gray-700" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 bg-gray-800 text-gray-100 border-none shadow-lg">
        <CardContent className="text-center py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleRetry} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            再試行
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!book) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 bg-gray-800 text-gray-100 border-none shadow-lg">
        <CardContent className="text-center py-8">
          <p className="text-xl font-semibold">本が見つかりませんでした</p>
        </CardContent>
      </Card>
    );
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
