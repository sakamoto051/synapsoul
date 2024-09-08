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
    isLoading,
  } = useBookSearch();

  const [view, setView] = useState<"grid" | "list">("grid");

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch],
  );

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (value: string) => {
        setter(value);
        debouncedSearch();
      },
    [debouncedSearch],
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
          onSearchTermChange={handleInputChange(setSearchTerm)}
          onAuthorInputChange={handleInputChange(setAuthorInput)}
          onPublisherInputChange={handleInputChange(setPublisherInput)}
          onGenreInputChange={handleInputChange(setGenreInput)}
          onSubmit={handleSearch}
          onViewChange={setView}
          view={view}
        />
      </div>
      {isLoading ? (
        <div className="text-center mt-4">読み込み中...</div>
      ) : (
        <>
          <BookSearchResults
            books={books}
            view={view}
            searchTerm={searchTerm}
            authorInput={authorInput}
            publisherInput={publisherInput}
            genreInput={genreInput}
            currentPage={currentPage}
          />
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
        </>
      )}
    </div>
  );
};

export default BookSearchPage;
