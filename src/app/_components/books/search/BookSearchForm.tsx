import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  return (
    <form onSubmit={onSubmit} className="mb-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <Input
          type="text"
          placeholder="タイトルで検索"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border-gray-700"
        />
        <Input
          type="text"
          placeholder="著者名で検索"
          value={authorInput}
          onChange={(e) => onAuthorInputChange(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border-gray-700"
        />
        <Input
          type="text"
          placeholder="出版社で検索"
          value={publisherInput}
          onChange={(e) => onPublisherInputChange(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border-gray-700"
        />
        <div className="relative">
          <Select value={genreInput} onValueChange={onGenreInputChange}>
            <SelectTrigger className="w-full bg-gray-800 text-gray-100 border-gray-700">
              <SelectValue placeholder="ジャンルを選択" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(booksGenreId).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {genreInput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-100"
              onClick={() => onGenreInputChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          type="submit"
          className="flex-grow bg-blue-600 hover:bg-blue-700"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>検索</span>
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
      </div>
    </form>
  );
};

export default BookSearchForm;
