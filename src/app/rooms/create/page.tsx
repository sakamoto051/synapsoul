"use client";
import type React from "react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import RoomTitleInput from "~/app/_components/rooms-create/room-title-input";
import RoomContentInput from "~/app/_components/rooms-create/room-content-input";
import TagsInput from "~/app/_components/rooms-create/tags-input";
import type { Prisma } from "@prisma/client";

// Define a type that includes both TagCreateInput and an id
type TagWithId = Prisma.TagCreateInput & { id: string };

const CreateRoomPage: React.FC = () => {
  const [roomTitle, setRoomTitle] = useState<string>("");
  const [roomContent, setRoomContent] = useState<string>("");
  const [tags, setTags] = useState<TagWithId[]>([]);
  const utils = api.useUtils();
  const router = useRouter();
  const { refetch } = api.room.list.useQuery();

  const createRoom = api.room.create.useMutation({
    onSuccess: async () => {
      await utils.room.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createRoom.mutate({
        title: roomTitle,
        content: roomContent,
        tags: tags.map(({ id, ...tag }) => tag), // Remove the id before sending to the API
      });
      console.log("Room created.");
      await refetch();
      router.push("/rooms");
    } catch (error) {
      console.error("Room create error:", error);
    }
  };

  const handleTagRemove = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-8">Create New Room</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <RoomTitleInput
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
        />
        <RoomContentInput
          value={roomContent}
          onChange={(e) => setRoomContent(e.target.value)}
        />
        <TagsInput
          tags={tags}
          setTags={setTags}
          handleTagRemove={handleTagRemove}
        />
        <button
          type="submit"
          className="bg-green-800 text-white rounded-md px-6 py-2 hover:bg-green-700 transition-colors"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoomPage;
