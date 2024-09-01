"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BookItem, BookItemWrapper } from "~/types/book";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BASE_API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

const BookList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("title") || "");
  const [authorInput, setAuthorInput] = useState(
    searchParams.get("author") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const updateUrlParams = useCallback(
    (title: string, author: string, page: number) => {
      const params = new URLSearchParams(searchParams);
      if (title) params.set("title", title);
      if (author) params.set("author", author);
      params.set("page", String(page));
      router.push(`/books?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const fetchBooks = useCallback(
    async (page: number, title: string, author: string) => {
      try {
        let apiUrl = `${BASE_API_ENDPOINT}&page=${page}`;
        if (title) apiUrl += `&title=${encodeURIComponent(title)}`;
        if (author) apiUrl += `&author=${encodeURIComponent(author)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setBooks(data.Items.map((item: BookItemWrapper) => item.Item));
        setTotalPages(data.pageCount);
        setTotalCount(data.count);
        setCurrentPage(page);
        updateUrlParams(title, author, page);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
    [updateUrlParams],
  );

  useEffect(() => {
    fetchBooks(currentPage, searchTerm, authorInput);
  }, [fetchBooks, currentPage, searchTerm, authorInput]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchBooks(1, searchTerm, authorInput);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <form onSubmit={handleSearch} className="mb-4 flex flex-col gap-2">
        <Input
          type="text"
          placeholder="タイトルで検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-white border-gray-700"
        />
        <Input
          type="text"
          placeholder="著者名で検索"
          value={authorInput}
          onChange={(e) => setAuthorInput(e.target.value)}
          className="bg-gray-800 text-white border-gray-700"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          検索
        </Button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {books.map((book: BookItem) => (
          <Link
            key={book.isbn}
            href={`/books/${book.isbn}?title=${encodeURIComponent(searchTerm)}&author=${encodeURIComponent(authorInput)}&page=${currentPage}`}
            className="block"
          >
            <div className="flex flex-col items-center p-2 rounded-md bg-gray-800 transition-colors hover:bg-gray-700">
              <img
                src={book.largeImageUrl}
                alt={book.title}
                className="w-full h-auto mb-2 rounded-md"
              />
              <h3 className="text-sm font-semibold text-center truncate w-full">
                {book.title}
              </h3>
              <p className="text-xs text-gray-400 text-center truncate w-full">
                {book.author}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-center items-center gap-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Previous
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Next
        </Button>
      </div>
      <div className="mt-2 text-center">{`Total results: ${totalCount}`}</div>
    </div>
  );
};

export default BookList;
