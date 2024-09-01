"use client";
import type React from "react";
import { useRoomList } from "~/hooks/useRoomList";
import { RoomSearch } from "~/app/_components/rooms/RoomSearch";
import { RoomList } from "~/app/_components/rooms/RoomList";

const RoomListPage: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    filteredRooms,
    error,
    handleCreateRoom,
  } = useRoomList();

  if (error) {
    return <div>Error loading rooms: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <RoomSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        onCreateRoom={handleCreateRoom}
      />
      {filteredRooms.length > 0 ? (
        <RoomList rooms={filteredRooms} />
      ) : (
        <div>No rooms found matching your criteria.</div>
      )}
    </div>
  );
};

export default RoomListPage;
