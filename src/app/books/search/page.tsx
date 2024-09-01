// src/app/books/search/page.tsx
"use client";
import type React from "react";
import { useBookSearch } from "~/hooks/useBookSearch";
import { BookSearchForm } from "~/app/_components/books/search/BookSearchForm";
import { BookSearchResults } from "~/app/_components/books/search/BookSearchResults";
import { Pagination } from "~/app/_components/books/search/Pagination";

const BookSearchPage: React.FC = () => {
  const {
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
      <BookSearchResults books={books} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div className="mt-2 text-center">{`Total results: ${totalCount}`}</div>
    </div>
  );
};

export default BookSearchPage;
