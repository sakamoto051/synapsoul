// src/components/RoomSearch.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Tag } from "@prisma/client";
import TagFilter from "./TagFilter";

interface RoomSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTags: Tag[];
  onTagsChange: React.Dispatch<React.SetStateAction<Tag[]>>;
  onCreateRoom: () => void;
}

export const RoomSearch: React.FC<RoomSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  onCreateRoom,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
    <Input
      type="text"
      placeholder="Search rooms..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="bg-gray-700 border-none w-full sm:w-auto"
      aria-label="Search rooms"
    />
    <TagFilter
      selectedTags={selectedTags}
      setSelectedTags={
        onTagsChange as React.Dispatch<React.SetStateAction<Tag[]>>
      }
    />
    <Button
      onClick={onCreateRoom}
      type="button"
      className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors flex items-center justify-center w-full sm:w-auto"
    >
      <PlusCircle size={24} />
      <span className="ml-2">Create Room</span>
    </Button>
  </div>
);
