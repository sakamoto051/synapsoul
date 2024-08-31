// src/app/books/search/page.tsx
"use client";
import type React from "react";
import { useBookSearch } from "~/hooks/useBookSearch";
import { BookSearchForm } from "~/app/_components/books/search/BookSearchForm";
import { BookList } from "~/app/_components/books/search/BookList";
import { Pagination } from "~/app/_components/books/search/Pagination";

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
          <BookList
            books={books}
            currentPage={currentPage}
            searchTerm={searchTerm}
            authorInput={authorInput}
          />
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
