"use client";
import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookStatus } from "@prisma/client";
import type { BookWithDetails } from "~/types/book";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import BookCard from "~/app/_components/books/BookCard";

const MyBooksPage = () => {
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookStatus | "ALL">("ALL");
  const updateStatusMutation = api.book.updateStatus.useMutation();
  const {
    data: userBooks,
    isLoading,
    error,
    refetch: refetchBooks,
  } = api.book.getUserBooks.useQuery();
  const { toast } = useToast();

  useEffect(() => {
    if (userBooks) {
      setBooks(
        userBooks.filter((book): book is BookWithDetails => book !== undefined),
      );
    }
  }, [userBooks]);

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book: BookWithDetails) =>
          (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (statusFilter === "ALL" || book.status === statusFilter),
      ),
    [books, searchTerm, statusFilter],
  );

  const handleStatusChange = async (
    book: BookWithDetails,
    newStatus: BookStatus | null,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        isbn: book.isbn,
        status: newStatus,
      });

      if (newStatus === null) {
        setBooks((prevBooks) => prevBooks.filter((b) => b.isbn !== book.isbn));
        toast({
          title: "ステータス解除",
          description: "本のステータスを解除し、マイブックから削除しました。",
        });
      } else {
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.isbn === book.isbn ? { ...b, status: newStatus } : b,
          ),
        );
        toast({
          title: "ステータス更新",
          description: `本のステータスを "${newStatus}" に更新しました。`,
        });
      }

      await refetchBooks();
    } catch (error) {
      console.error("Failed to update book status:", error);
      toast({
        title: "エラー",
        description: "本のステータス更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const generateSkeletonKey = () =>
    `skeleton-${Math.random().toString(36).substr(2, 9)}`;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-blue-300">マイブックス</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map(() => (
            <Card
              key={generateSkeletonKey()}
              className="bg-gray-800 border-none shadow-lg"
            >
              <CardHeader>
                <Skeleton className="h-40 w-full bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-blue-300">マイブックス</h1>
        <Card className="bg-gray-800 border-none shadow-lg">
          <CardContent className="text-center py-8">
            <Alert variant="destructive">
              <AlertDescription>
                本の情報の取得中にエラーが発生しました。
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetchBooks()} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              再試行
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-300">マイブックス</h1>

      <div className="flex mb-4 gap-2">
        <Input
          type="text"
          placeholder="本を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
        />
        <Select
          onValueChange={(value) =>
            setStatusFilter(value as BookStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[180px] bg-gray-800 text-gray-100 border-gray-700">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
            <SelectItem value="ALL">すべて</SelectItem>
            <SelectItem value={BookStatus.READING}>読んでいる本</SelectItem>
            <SelectItem value={BookStatus.TO_READ}>積んでいる本</SelectItem>
            <SelectItem value={BookStatus.INTERESTED}>気になる本</SelectItem>
            <SelectItem value={BookStatus.FINISHED}>読み終わった本</SelectItem>
            <SelectItem value={BookStatus.DNF}>読むのをやめた本</SelectItem>
            <SelectItem value={BookStatus.REFERENCE}>参考書</SelectItem>
            <SelectItem value={BookStatus.FAVORITE}>お気に入り</SelectItem>
            <SelectItem value={BookStatus.REREADING}>再読中</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.isbn}
            book={book}
            onStatusChange={handleStatusChange}
            isInMyBooks={true}
          />
        ))}
      </div>
      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          条件に一致する本が見つかりません。
        </p>
      )}
    </div>
  );
};

export default MyBooksPage;
