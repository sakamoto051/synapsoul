// src/app/_components/books/mybooks/MyBooksFilter.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookStatus } from "@prisma/client";
import { bookStatusConfig } from "~/config/bookStatus";

interface MyBooksFilterProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onStatusFilterChange: (value: BookStatus | "ALL") => void;
}

export const MyBooksFilter: React.FC<MyBooksFilterProps> = ({
  searchTerm,
  onSearchTermChange,
  onStatusFilterChange,
}) => (
  <div className="flex mb-4 gap-2">
    <Input
      type="text"
      placeholder="本を検索..."
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
      className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
    />
    <Select
      onValueChange={(value) =>
        onStatusFilterChange(value as BookStatus | "ALL")
      }
    >
      <SelectTrigger className="w-[180px] bg-gray-800 text-gray-100 border-gray-700">
        <SelectValue placeholder="ステータス" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
        <SelectItem value="ALL">すべて</SelectItem>
        {Object.entries(bookStatusConfig).map(([status, config]) => (
          <SelectItem key={status} value={status}>
            {config.icon} {config.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
