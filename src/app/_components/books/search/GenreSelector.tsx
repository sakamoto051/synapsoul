import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";

interface GenreSelectorProps {
  genres: [string, string][];
  selectedGenre: string;
  onGenreChange: (genreId: string) => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  selectedGenre,
  onGenreChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedGenreName =
    genres.find(([id]) => id === selectedGenre)?.[1] ?? "ジャンル";

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the popover from opening
    onGenreChange("");
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-gray-800 text-gray-100 border-gray-700 pr-8"
          >
            {selectedGenre ? selectedGenreName : "ジャンル"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <ScrollArea className="h-80">
            <div className="p-4">
              {genres.map(([id, name]) => (
                <Button
                  key={id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onGenreChange(id);
                    setIsOpen(false);
                  }}
                >
                  {name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {selectedGenre && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={handleReset}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
