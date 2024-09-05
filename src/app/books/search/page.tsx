"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useBookSearch } from "~/hooks/useBookSearch";
import { BookSearchForm } from "~/app/_components/books/search/BookSearchForm";
import { BookSearchResults } from "~/app/_components/books/search/BookSearchResults";
import { Pagination } from "~/app/_components/books/search/Pagination";
import debounce from "lodash/debounce";

const BookSearchPage: React.FC = () => {
  const {
    books,
    searchTerm,
    setSearchTerm,
    authorInput,
    setAuthorInput,
    publisherInput,
    setPublisherInput,
    genreInput,
    setGenreInput,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange,
    handleSearch,
  } = useBookSearch();

  const [view, setView] = useState<"grid" | "list">("grid");

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch],
  );

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchTermChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      debouncedSearch({} as React.FormEvent<HTMLFormElement>);
    },
    [setSearchTerm, debouncedSearch],
  );

  const handleAuthorInputChange = useCallback(
    (value: string) => {
      setAuthorInput(value);
      debouncedSearch({} as React.FormEvent<HTMLFormElement>);
    },
    [setAuthorInput, debouncedSearch],
  );

  const handlePublisherInputChange = useCallback(
    (value: string) => {
      setPublisherInput(value);
      debouncedSearch({} as React.FormEvent<HTMLFormElement>);
    },
    [setPublisherInput, debouncedSearch],
  );

  const handleGenreInputChange = useCallback(
    (value: string) => {
      setGenreInput(value);
      debouncedSearch({} as React.FormEvent<HTMLFormElement>);
    },
    [setGenreInput, debouncedSearch],
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-center">本を探す</h1>
      <div className="max-w-3xl mx-auto">
        <BookSearchForm
          searchTerm={searchTerm}
          authorInput={authorInput}
          publisherInput={publisherInput}
          genreInput={genreInput}
          onSearchTermChange={handleSearchTermChange}
          onAuthorInputChange={handleAuthorInputChange}
          onPublisherInputChange={handlePublisherInputChange}
          onGenreInputChange={handleGenreInputChange}
          onSubmit={handleSearch}
          onViewChange={setView}
          view={view}
        />
      </div>
      <BookSearchResults books={books} view={view} />
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="mt-2 text-center text-sm">
          {`検索結果: ${totalCount}`}
        </div>
      </div>
    </div>
  );
};

export default BookSearchPage;
