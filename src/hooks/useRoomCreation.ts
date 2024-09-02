import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { TagWithId } from "~/types/tag";

export const useRoomCreation = () => {
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
      await createRoom.mutateAsync({
        title: roomTitle,
        content: roomContent,
        tags: tags.map(({ ...tag }) => tag),
      });
      console.log("Room created.");
      await refetch();
      router.push("/rooms");
    } catch (error) {
      console.error("Room create error:", error);
    }
  };

  const handleTagRemove = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return {
    roomTitle,
    setRoomTitle,
    roomContent,
    setRoomContent,
    tags,
    setTags,
    handleSubmit,
    handleTagRemove,
  };
};
