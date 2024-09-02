// src/app/books/mybooks/page.tsx
"use client";
import { useMyBooks } from "~/hooks/useMyBooks";
import { MyBooksFilter } from "~/app/_components/books/mybooks/MyBooksFilter";
import { MyBooksList } from "~/app/_components/books/mybooks/MyBooksList";

const MyBooksPage = () => {
  const {
    books,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    handleStatusChange,
  } = useMyBooks();

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-300">マイブックス</h1>
      <MyBooksFilter
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />
      <MyBooksList books={books} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default MyBooksPage;
