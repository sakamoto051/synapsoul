"use client";
import { api } from "~/trpc/react";
import BookCard from "../books/BookCard";
import type { BookWithDetails } from "~/types/book";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { getGenreId } from "~/hooks/useBookSearch";

export default function PopularBookBar({ genre }: { genre: string }) {
  const { data: popularBooks } = api.bookAPI.getPopularBooks.useQuery({
    booksGenreId: getGenreId(genre) ?? "",
  });

  return (
    <div className="mt-4 w-full">
      <h2 className="text-lg font-bold mb-1">人気の{genre}</h2>
      <div className="grid grid-12">
        <ScrollArea className="rounded-md border">
          <div className="flex w-max p-2">
            {popularBooks?.map((book) => (
              <BookCard
                key={book.isbn}
                book={book as BookWithDetails}
                isInMyBooks={false}
                showStatus={false}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
