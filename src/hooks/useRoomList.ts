// src/hooks/useRoomList.ts
import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { Tag } from "@prisma/client";

export const useRoomList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const router = useRouter();
  const roomsQuery = api.room.list.useQuery();

  const filteredRooms = useMemo(() => {
    return (
      roomsQuery.data?.filter((room) => {
        const isSearchMatch =
          room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.content.toLowerCase().includes(searchTerm.toLowerCase());

        const isTagMatch =
          selectedTags.length === 0 ||
          selectedTags.some((tag) =>
            room.tags.some((t) => t.name === tag.name),
          );

        return isSearchMatch && isTagMatch;
      }) ?? []
    );
  }, [roomsQuery.data, searchTerm, selectedTags]);

  const handleCreateRoom = () => {
    router.push("/rooms/create");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    filteredRooms,
    isLoading: roomsQuery.isLoading,
    error: roomsQuery.error,
    handleCreateRoom,
  };
};
