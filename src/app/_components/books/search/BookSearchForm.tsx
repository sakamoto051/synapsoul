import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { booksGenreId } from "~/hooks/useBookSearch";

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
  const [searchType, setSearchType] = useState<
    "title" | "author" | "publisher"
  >("title");
  const placeholders = {
    title: "タイトルで検索...",
    author: "著者で検索...",
    publisher: "出版社で検索...",
  };

  const handleSearchChange = (value: string) => {
    switch (searchType) {
      case "title":
        onSearchTermChange(value);
        break;
      case "author":
        onAuthorInputChange(value);
        break;
      case "publisher":
        onPublisherInputChange(value);
        break;
    }
  };

  const selectedGenreName = genreInput
    ? booksGenreId[genreInput as keyof typeof booksGenreId]
    : "ジャンル";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center gap-2 my-3"
    >
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder={placeholders[searchType]}
          value={
            searchType === "title"
              ? searchTerm
              : searchType === "author"
                ? authorInput
                : publisherInput
          }
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border-gray-700 pr-24"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-full px-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSearchType("title")}>
                タイトル
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchType("author")}>
                著者
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchType("publisher")}>
                出版社
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-gray-800 text-gray-100 border-gray-700"
          >
            {selectedGenreName}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(booksGenreId).map(([id, name]) => (
            <DropdownMenuItem key={id} onSelect={() => onGenreInputChange(id)}>
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {genreInput && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onGenreInputChange("")}
          className="text-gray-400 hover:text-gray-100 hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        <Search className="h-4 w-4" />
      </Button>

      <div className="flex border border-gray-700 rounded-md">
        <Button
          type="button"
          onClick={() => onViewChange("grid")}
          variant="ghost"
          size="icon"
          className={`rounded-r-none ${view === "grid" ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => onViewChange("list")}
          variant="ghost"
          size="icon"
          className={`rounded-l-none border-l border-gray-700 ${view === "list" ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default BookSearchForm;
