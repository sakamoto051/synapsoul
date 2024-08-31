// src/components/BookSearchForm.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookSearchFormProps {
  searchTerm: string;
  authorInput: string;
  onSearchTermChange: (value: string) => void;
  onAuthorInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const BookSearchForm: React.FC<BookSearchFormProps> = ({
  searchTerm,
  authorInput,
  onSearchTermChange,
  onAuthorInputChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="mb-4 flex flex-col gap-2">
    <Input
      type="text"
      placeholder="タイトルで検索"
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
      className="bg-gray-800 text-gray-100 border-gray-700"
    />
    <Input
      type="text"
      placeholder="著者名で検索"
      value={authorInput}
      onChange={(e) => onAuthorInputChange(e.target.value)}
      className="bg-gray-800 text-gray-100 border-gray-700"
    />
    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
      検索
    </Button>
  </form>
);

export default BookSearchForm;
