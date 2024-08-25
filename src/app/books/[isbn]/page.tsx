'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { BookItem } from '~/types/book';
import { api } from "~/trpc/react";
import { BookStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ChevronLeft, Book, BookOpen, BookMarked } from "lucide-react";

const APPLICATION_ID = process.env.NEXT_PUBLIC_RAKUTEN_APPLICATION_ID;
const API_ENDPOINT = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&applicationId=${APPLICATION_ID}`;

const BookDetail = () => {
  const [book, setBook] = useState<BookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isbn = params['isbn'] as string;
  const updateStatusMutation = api.book.updateStatus.useMutation();
  const { toast } = useToast();

  const { data: currentStatus, refetch: refetchStatus } = api.book.getStatus.useQuery({ isbn });

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!isbn) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
        const data = await response.json();
        if (data.Items && data.Items.length > 0) {
          setBook(data.Items[0].Item);
        } else {
          console.error('Book not found');
          setBook(null);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [isbn]);

  const handleBack = () => {
    const title = searchParams.get('title') || '';
    const author = searchParams.get('author') || '';
    const page = searchParams.get('page') || '1';

    const searchConditions = new URLSearchParams();
    if (title) searchConditions.append('title', title);
    if (author) searchConditions.append('author', author);
    if (page !== '1') searchConditions.append('page', page);

    const searchString = searchConditions.toString();
    router.push(`/books?${searchString}`);
  };

  const updateBookStatus = async (status: BookStatus) => {
    if (!book) return;

    try {
      await updateStatusMutation.mutateAsync({
        isbn: book.isbn,
        status: status,
      });
      await refetchStatus();
      toast({
        title: "ステータス更新",
        description: `本のステータスを "${status}" に更新しました。`,
        action: <ToastAction altText="閉じる">閉じる</ToastAction>,
      });
    } catch (error) {
      console.error('Error updating book status:', error);
      toast({
        title: "エラー",
        description: "本のステータス更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
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
          <CardTitle className="text-2xl font-bold text-blue-300">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={book.largeImageUrl}
              alt={book.title}
              className="w-48 h-auto object-cover rounded-md shadow-md"
            />
            <div className="flex-1">
              <p><strong className="text-blue-300">著者:</strong> {book.author}</p>
              <p><strong className="text-blue-300">出版社:</strong> {book.publisherName}</p>
              <p><strong className="text-blue-300">発売日:</strong> {book.salesDate}</p>
              <p><strong className="text-blue-300">ISBN:</strong> {book.isbn}</p>
              <p><strong className="text-blue-300">価格:</strong> {book.itemPrice}円</p>
              <p className="mt-4 text-gray-300">{book.itemCaption}</p>
              <div className="mt-6 space-x-2">
                <Button
                  onClick={() => updateBookStatus(BookStatus.READING)}
                  className={`${currentStatus === BookStatus.READING
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  読んでいる本
                </Button>
                <Button
                  onClick={() => updateBookStatus(BookStatus.TO_READ)}
                  className={`${currentStatus === BookStatus.TO_READ
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                >
                  <Book className="mr-2 h-4 w-4" />
                  積んでいる本
                </Button>
                <Button
                  onClick={() => updateBookStatus(BookStatus.INTERESTED)}
                  className={`${currentStatus === BookStatus.INTERESTED
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                >
                  <BookMarked className="mr-2 h-4 w-4" />
                  気になる本
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Button onClick={handleBack} className="bg-gray-700 text-white hover:bg-gray-600">
          <ChevronLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
      </div>
    </div>
  );
};

export default BookDetail;