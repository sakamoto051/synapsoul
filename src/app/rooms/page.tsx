"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";
import RoomCard from "../_components/rooms/room-card";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import TagFilter from "../_components/rooms/tag-filter";
import type { Tag } from "@prisma/client";

export const RoomSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const roomsQuery = api.room.list.useQuery();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const filteredRooms =
    roomsQuery.data?.filter((room) => {
      const isSearchMatch =
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.content.toLowerCase().includes(searchTerm.toLowerCase());

      const isTagMatch =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => room.tags.some((t) => t.name === tag.name));

      return isSearchMatch && isTagMatch;
    }) ?? [];

  const handleCreateRoom = () => {
    router.push("/rooms/create");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 border-none w-full sm:w-auto"
          aria-label="Search rooms"
        />
        <TagFilter
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <Button
          onClick={handleCreateRoom}
          type="button"
          className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          <PlusCircle size={24} />
          <span className="ml-2">Create Room</span>
        </Button>
      </div>
      {roomsQuery.isLoading ? (
        <div>Loading rooms...</div>
      ) : roomsQuery.error ? (
        <div>Error loading rooms: {roomsQuery.error.message}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} tags={room.tags} />
            ))
          ) : (
            <div>No rooms found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomSearch;
