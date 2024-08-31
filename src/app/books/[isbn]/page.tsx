"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { BookItem } from "~/types/book";
import { api } from "~/trpc/react";
import type { BookStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  ChevronLeft,
  BookText,
  ShoppingCart,
  Users,
  RefreshCw,
} from "lucide-react";
import BookThreadList from "~/app/_components/books/thread-list";
import { BookStatusDropdown } from "~/app/_components/books/book-status-dropdown";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

const BookDetail = () => {
  const [book, setBook] = useState<BookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isbn = params.isbn as string;
  const updateStatusMutation = api.book.updateStatus.useMutation();
  const { toast } = useToast();

  const [currentStatus, setCurrentStatus] = useState<BookStatus | null>(null);
  const [isInMyBooks, setIsInMyBooks] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<BookStatus | null>(null);

  const { data: initialStatus, refetch: refetchStatus } =
    api.book.getStatus.useQuery({ isbn });

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!isbn) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Items && data.Items.length > 0) {
          setBook(data.Items[0].Item);
        } else {
          setError("書籍情報が見つかりませんでした。");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("書籍情報の取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [isbn]);

  useEffect(() => {
    if (initialStatus !== undefined) {
      setCurrentStatus(initialStatus);
      setIsInMyBooks(initialStatus !== null);
    }
  }, [initialStatus]);

  const handleBack = () => {
    const title = searchParams.get("title") || "";
    const author = searchParams.get("author") || "";
    const page = searchParams.get("page") || "1";

    const searchConditions = new URLSearchParams();
    if (title) searchConditions.append("title", title);
    if (author) searchConditions.append("author", author);
    if (page !== "1") searchConditions.append("page", page);

    const searchString = searchConditions.toString();
    router.push(`/books/search?${searchString}`);
  };

  const updateBookStatus = async (status: BookStatus | null) => {
    if (!book) return;

    try {
      await updateStatusMutation.mutateAsync({
        isbn: book?.isbn ?? "",
        status: status,
      });
      await refetchStatus();

      // 状態を更新
      setCurrentStatus(status);
      setIsInMyBooks(status !== null);

      if (status === null) {
        toast({
          title: "ステータス解除",
          description:
            "本のステータスを解除し、マイブックから削除しました。関連する読書メモも削除されました。",
          action: <ToastAction altText="閉じる">閉じる</ToastAction>,
        });
      } else {
        toast({
          title: "ステータス更新",
          description: `本のステータスを "${status}" に更新しました。`,
          action: <ToastAction altText="閉じる">閉じる</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error updating book status:", error);
      toast({
        title: "エラー",
        description: "本のステータス更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: BookStatus | null) => {
    if (newStatus === null && isInMyBooks) {
      setPendingStatus(null);
      setIsConfirmOpen(true);
    } else {
      await updateBookStatus(newStatus);
    }
  };

  const confirmStatusChange = () => {
    setIsConfirmOpen(false);
    updateBookStatus(pendingStatus);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    refetchStatus();
    // 書籍情報も再取得
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Items && data.Items.length > 0) {
          setBook(data.Items[0].Item);
        } else {
          setError("書籍情報が見つかりませんでした。");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("書籍情報の取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  };

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 bg-gray-800 text-gray-100 border-none shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 bg-gray-700" />
        </CardHeader>
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
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
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
                <strong className="text-blue-300">発売日:</strong>{" "}
                {book.salesDate}
              </p>
              <p>
                <strong className="text-blue-300">ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong className="text-blue-300">価格:</strong>{" "}
                {book.itemPrice}円
              </p>
              <p className="mt-4 text-gray-300">{book.itemCaption}</p>
              <div className="mt-6">
                <BookStatusDropdown
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  isInMyBooks={isInMyBooks}
                />{" "}
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
                <Link href={`/books/${isbn}/notes`} passHref>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <BookText className="mr-2 h-4 w-4" />
                    読書メモ
                  </Button>
                </Link>
                <Link href={`/books/${isbn}/public-notes`} passHref>
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
