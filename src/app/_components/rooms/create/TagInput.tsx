import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { api } from "~/trpc/react";
import type { TagWithId } from "~/types/tag";

interface TagsInputProps {
  tags: TagWithId[];
  setTags: React.Dispatch<React.SetStateAction<TagWithId[]>>;
  handleTagRemove: (id: number) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  setTags,
  handleTagRemove,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<TagWithId[]>([]);
  const containerRef = useRef(null);
  const tagsQuery = api.tag.list.useQuery();

  const fetchTags = useCallback(
    async (query: string) => {
      const filteredTags = tagsQuery.data
        ?.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
        .map((tag) => ({
          ...tag,
          id: tag.id,
        }));
      return filteredTags ?? [];
    },
    [tagsQuery.data],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      void (async () => {
        if (inputValue) {
          const fetchedTags = await fetchTags(inputValue);
          setSuggestions(fetchedTags);
        } else {
          setSuggestions([]);
        }
      })();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, fetchTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addTag();
  };

  const addTag = () => {
    if (inputValue.trim()) {
      const newTag: TagWithId = {
        id: Date.now(),
        name: inputValue.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTags([...tags, newTag]);
      setInputValue("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: TagWithId) => {
    setInputValue("");
    setSuggestions([]);
    setTags([...tags, suggestion]);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="flex space-x-2 flex-wrap">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Enter a tag"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="bg-gray-700 border-none"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddTag}
          className="bg-blue-700 hover:bg-blue-600"
        >
          Add
        </Button>
      </div>
      <div className="relative">
        {suggestions.length > 0 && (
          <ul className="border border-gray-500 rounded-md absolute w-full overflow-hidden">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="bg-gray-700">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex space-x-2 flex-wrap">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center space-x-2"
          >
            <span>{tag.name}</span>
            <button
              type="button"
              className="text-white hover:text-gray-300"
              onClick={() => handleTagRemove(tag.id)}
            >
              <CircleX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
