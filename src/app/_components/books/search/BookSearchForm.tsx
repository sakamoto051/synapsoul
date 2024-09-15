import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
import { booksGenreId } from "~/hooks/useBookSearch";
import { GenreSelector } from "./GenreSelector";

interface BookSearchFormProps {
  searchTerm: string;
  authorInput: string;
  publisherInput: string;
  genreInput: string;
  onSearchTermChange: (value: string) => void;
  onAuthorInputChange: (value: string) => void;
  onPublisherInputChange: (value: string) => void;
  onGenreInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onViewChange: (view: "grid" | "list") => void;
  view: "grid" | "list";
}

export const BookSearchForm: React.FC<BookSearchFormProps> = ({
  searchTerm,
  authorInput,
  publisherInput,
  genreInput,
  onSearchTermChange,
  onAuthorInputChange,
  onPublisherInputChange,
  onGenreInputChange,
  onSubmit,
  onViewChange,
  view,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center gap-2 my-3"
    >
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="タイトルで検索..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border-gray-700 pr-24"
        />
      </div>

      <Input
        type="text"
        placeholder="著者で検索..."
        value={authorInput}
        onChange={(e) => onAuthorInputChange(e.target.value)}
        className="w-full sm:w-auto bg-gray-800 text-gray-100 border-gray-700"
      />

      <Input
        type="text"
        placeholder="出版社で検索..."
        value={publisherInput}
        onChange={(e) => onPublisherInputChange(e.target.value)}
        className="w-full sm:w-auto bg-gray-800 text-gray-100 border-gray-700"
      />

      <GenreSelector
        genres={Object.entries(booksGenreId)}
        selectedGenre={genreInput}
        onGenreChange={onGenreInputChange}
      />

      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        <Search className="h-4 w-4" />
      </Button>

      <div className="flex border border-gray-700 rounded-md">
        <Button
          type="button"
          onClick={() => onViewChange("grid")}
          variant="ghost"
          size="icon"
          className={`rounded-r-none ${
            view === "grid" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => onViewChange("list")}
          variant="ghost"
          size="icon"
          className={`rounded-l-none border-l border-gray-700 ${
            view === "list" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default BookSearchForm;
