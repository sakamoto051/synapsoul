import { Tag } from '@prisma/client';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '~/components/ui/dialog';
import { api } from '~/trpc/react';

const TagFilter = ({
    selectedTags,
    setSelectedTags,
}: {
    selectedTags: Tag[],
    setSelectedTags: Dispatch<SetStateAction<Tag[]>>,
}) => {
  const tagsQuery = api.tag.list.useQuery();

  const handleTagClick = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      console.log(selectedTags);
    } else {
        setSelectedTags([...selectedTags, tag]);
        console.log(selectedTags);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-600">Filter by Tags</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Tags</DialogTitle>
            <DialogDescription>Please select filter tags.</DialogDescription>
        </DialogHeader>
        <div className="space-x-1">
          {tagsQuery.data?.map(tag => (
            <Badge
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={selectedTags.includes(tag) ? "" : "bg-white-800 border-black text-black hover:text-white"}
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