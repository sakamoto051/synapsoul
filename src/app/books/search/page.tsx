// src/app/books/search/page.tsx
"use client";
import type React from "react";
import { useBookSearch } from "~/hooks/useBookSearch";
import { BookSearchForm } from "~/app/_components/books/search/BookSearchForm";
import { Pagination } from "~/app/_components/books/search/Pagination";
import type { BookItem, BookWithDetails } from "~/types/book";
import BookCard from "~/app/_components/books/BookCard";

const BookSearchPage: React.FC = () => {
  const {
    books,
    searchTerm,
    setSearchTerm,
    authorInput,
    setAuthorInput,
    loading,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange,
    handleSearch,
  } = useBookSearch();

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <BookSearchForm
        searchTerm={searchTerm}
        authorInput={authorInput}
        onSearchTermChange={setSearchTerm}
        onAuthorInputChange={setAuthorInput}
        onSubmit={handleSearch}
      />
      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book: BookItem) => (
              <BookCard
                key={book.isbn}
                book={book as BookWithDetails} // 型を合わせるために一時的な型変換を行っています
                onStatusChange={() => ({})}
                isInMyBooks={false}
                showStatus={false}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="mt-2 text-center">
            {`Total results: ${totalCount}`}
          </div>
        </>
      )}
    </div>
  );
};

export default BookSearchPage;
