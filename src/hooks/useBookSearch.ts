import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BookItem, BookItemWrapper, BookResponse } from "~/types/book";

const BASE_API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

export const useBookSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("title") ?? "");
  const [authorInput, setAuthorInput] = useState(
    searchParams.get("author") ?? "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1),
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const updateUrlParams = useCallback(
    (title: string, author: string, page: number) => {
      const params = new URLSearchParams(searchParams);
      if (title) params.set("title", title);
      if (author) params.set("author", author);
      params.set("page", String(page));
      router.push(`/books/search?${params.toString()}`, { scroll: false });
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
        const data: BookResponse = (await response.json()) as BookResponse;

        setBooks(data.Items.map((item: BookItemWrapper) => item.Item));
        setTotalPages(data.pageCount || 1);
        setTotalCount(data.count || 0);
        setCurrentPage(page);
        updateUrlParams(title, author, page);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
        setTotalPages(1);
        setTotalCount(0);

        // エラーハンドリングをここで行うこともできます
        // 例: toast.error("書籍の取得中にエラーが発生しました");
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

  return {
    books,
    searchTerm,
    setSearchTerm,
    authorInput,
    setAuthorInput,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange,
    handleSearch,
  };
};

export default useBookSearch;
