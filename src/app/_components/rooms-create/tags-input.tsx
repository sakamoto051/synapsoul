// components/TagsInput.tsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      onAddTag(currentTag);
      setCurrentTag('');
    }
  };

  return (
    <div>
      <label htmlFor="tags" className="block mb-2">Tags</label>
      <div className="flex">
        <Input
          id="tags"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          className="flex-grow mr-2 bg-gray-700"
          placeholder="Enter a tag"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap mt-2">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-700 text-white rounded-full px-3 py-1 m-1 flex items-center">
            {tag}
            <button type="button" onClick={() => onRemoveTag(tag)} className="ml-2">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
