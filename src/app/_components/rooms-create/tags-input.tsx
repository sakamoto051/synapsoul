import React, { useState, useEffect, useRef, ChangeEvent, MouseEvent } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CircleX } from 'lucide-react';
import { api } from '~/trpc/react';
import { Prisma } from '@prisma/client';

const TagInput = ({
  tags,
  setTags,
  handleTagRemove,
}: {
  tags: Prisma.TagCreateInput[],
  setTags: React.Dispatch<React.SetStateAction<Prisma.TagCreateInput[]>>,
  handleTagRemove: (index: number) => void,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Prisma.TagCreateInput[] | undefined>([]);
  const containerRef = useRef(null);
  const tagsQuery = api.tag.list.useQuery();

  const fetchTags = async (query: string) => {
    const filteredTags = tagsQuery.data?.filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()));
    return filteredTags;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (inputValue) {
        const fetchedTags: Prisma.TagCreateInput[] | undefined = await fetchTags(inputValue);
        setSuggestions(fetchedTags);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTag: Prisma.TagCreateInput = {
        name: inputValue.trim(),
      };
      setTags([...tags, newTag]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Prisma.TagCreateInput) => {
    setInputValue('');
    setSuggestions([]);
    setTags([...tags, suggestion]);
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
            className="bg-gray-700 border-none"
          />
        </div>
        <Button onClick={handleAddTag} className="bg-blue-700 hover:bg-blue-600">Add</Button>
      </div>
      <div className="relative">
        {suggestions && suggestions.length > 0 && (
          <ul className="border border-gray-500 rounded-md absolute w-full overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer bg-gray-700"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex space-x-2 flex-wrap">
        {tags.map((tag, index) => (
          <div key={index} className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center space-x-2">
            <span>{tag.name}</span>
            <button
              className="text-white hover:text-gray-300"
              onClick={() => handleTagRemove(index)}
            >
              <CircleX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;