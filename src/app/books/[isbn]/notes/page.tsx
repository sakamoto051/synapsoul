"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ChevronLeft, Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BookNotesList = () => {
  const params = useParams();
  const isbn = params.isbn as string;

  const { data: book, isLoading } = api.book.getByIsbn.useQuery({ isbn });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full bg-gray-700 mb-4" />
            <Skeleton className="h-24 w-full bg-gray-700 mb-4" />
            <Skeleton className="h-24 w-full bg-gray-700" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            読書メモ一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          {book?.notes && book.notes.length > 0 ? (
            book.notes.map((note) => (
              <Link
                href={`/books/${isbn}/notes/${note.id}`}
                key={note.id}
                passHref
              >
                <Card className="mb-4 bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-blue-200">
                        {note.title}
                      </h3>
                      <Badge
                        variant={note.isPublic ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {note.isPublic ? (
                          <>
                            <Globe className="w-3 h-3 mr-1" />
                            公開
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            非公開
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">
                      作成日: {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400">
              まだ読書メモがありません。
            </p>
          )}
          <div className="mt-6 flex justify-between">
            <Link href={`/books/${isbn}`} passHref>
              <Button className="bg-gray-700 text-white hover:bg-gray-600">
                <ChevronLeft className="mr-2 h-4 w-4" />
                書籍詳細に戻る
              </Button>
            </Link>
            <Link href={`/books/${isbn}/notes/new`} passHref>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                新しい読書メモ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookNotesList;
