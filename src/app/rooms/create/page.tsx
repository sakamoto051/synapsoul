'use client';
import React, { useState } from 'react';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';
import RoomTitleInput from '~/app/_components/rooms-create/room-title-input';
import RoomContentInput from '~/app/_components/rooms-create/room-content-input';
import TagsInput from '~/app/_components/rooms-create/tags-input';

const CreateRoomPage = () => {
  const [roomTitle, setRoomTitle] = useState('');
  const [roomContent, setRoomContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const utils = api.useUtils();
  const router = useRouter();
  const { refetch } = api.room.list.useQuery();

  const createRoom = api.room.create.useMutation({
    onSuccess: async () => {
      await utils.room.invalidate();
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createRoom.mutate({
        title: roomTitle,
        content: roomContent,
        tags: tags,
      });
      console.log('Room created.');
      refetch();
      router.push('/rooms');
    } catch (error) {
      console.error('Room create error:', error);
    }
  };

  const addTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-8">Create New Room</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <RoomTitleInput value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} />
        <RoomContentInput value={roomContent} onChange={(e) => setRoomContent(e.target.value)} />
        <TagsInput tags={tags} onAddTag={addTag} onRemoveTag={removeTag} />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-md px-6 py-2 hover:bg-green-700 transition-colors"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;
