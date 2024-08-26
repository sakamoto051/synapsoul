'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book as BookImg, Search } from 'lucide-react';
import { BookStatus } from '@prisma/client';
import { BookWithDetails } from '~/types/book';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';



const MyBooksPage = () => {
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'ALL'>('ALL');
  const updateStatusMutation = api.book.updateStatus.useMutation();
  const router = useRouter();
  const { data: userBooks, isLoading } = api.book.getUserBooks.useQuery();

  useEffect(() => {
    if (userBooks) {
      setBooks(userBooks.filter((book): book is BookWithDetails => book !== undefined));
    }
  }, [userBooks]);

  const filteredBooks = useMemo(() =>
    books.filter((book: BookWithDetails) =>
      (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'ALL' || book.status === statusFilter)
    ),
    [books, searchTerm, statusFilter]
  );

  const handleStatusChange = async (book: BookWithDetails, status: BookStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        isbn: book.isbn,
        status: status,
      });

      // ローカルの状態を更新
      setBooks(prevBooks =>
        prevBooks.map(b =>
          b.isbn === book.isbn ? { ...b, status } : b
        )
      );
    } catch (error) {
      console.error("Failed to update book status:", error);
      // エラー処理をここに追加（例：ユーザーへの通知）
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-300">My Books</h1>

      <div className="flex mb-4 gap-2">
        <Input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
        />
        <Select onValueChange={(value) => setStatusFilter(value as BookStatus | 'ALL')}>
          <SelectTrigger className="w-[180px] bg-gray-800 text-gray-100 border-gray-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value={BookStatus.READING}>読んでいる本</SelectItem>
            <SelectItem value={BookStatus.TO_READ}>積んでいる本</SelectItem>
            <SelectItem value={BookStatus.INTERESTED}>気になる本</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="bg-gray-800 border-none shadow-lg">
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBooks.map((book) => (
            <Link href={`/books/${book.isbn}`} key={book.isbn} className="block">
              <Card className="bg-gray-800 text-gray-100 border-none shadow-lg flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 hover:bg-gray-700 cursor-pointer">
                <CardHeader className="p-2">
                  <img
                    src={book.largeImageUrl || '/api/placeholder/120/180'}
                    alt={book.title || 'Book cover'}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="text-sm font-medium text-blue-300 line-clamp-2 mb-1">
                    {book.title || 'Unknown Title'}
                  </CardTitle>
                  <p className="text-xs text-gray-400 line-clamp-1">{book.author || 'Unknown Author'}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 p-2">
                  <Select
                    onValueChange={(value) => handleStatusChange(book, value as BookStatus)}
                    defaultValue={book.status}
                  >
                    <SelectTrigger
                      className="w-full bg-gray-700 text-gray-100 border-gray-600 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                      <SelectItem value={BookStatus.READING}>読んでいる本</SelectItem>
                      <SelectItem value={BookStatus.TO_READ}>積んでいる本</SelectItem>
                      <SelectItem value={BookStatus.INTERESTED}>気になる本</SelectItem>
                    </SelectContent>
                  </Select>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;