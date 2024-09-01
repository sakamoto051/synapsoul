// src/components/rooms/tag-filter.tsx
import type { Tag } from "@prisma/client";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

interface TagFilterProps {
  selectedTags: Tag[];
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  const tagsQuery = api.tag.list.useQuery();

  const handleTagClick = (tag: Tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.some((t) => t.id === tag.id)) {
        return prevTags.filter((t) => t.id !== tag.id);
      }
      return [...prevTags, tag];
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-600">
          Filter by Tags
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tags</DialogTitle>
          <DialogDescription>Please select filter tags.</DialogDescription>
        </DialogHeader>
        <div className="space-x-1">
          {tagsQuery.data?.map((tag) => (
            <Badge
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={
                selectedTags.some((t) => t.id === tag.id)
                  ? ""
                  : "bg-white-800 border-black text-black hover:text-white"
              }
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagFilter;
