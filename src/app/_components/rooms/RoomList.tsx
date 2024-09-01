// src/components/RoomList.tsx
import type React from "react";
import RoomCard from "~/app/_components/rooms/room-card";
import type { Room, Tag } from "@prisma/client";

interface RoomListProps {
  rooms: (Room & { tags: Tag[] })[];
}

export const RoomList: React.FC<RoomListProps> = ({ rooms }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {rooms.map((room) => (
      <RoomCard key={room.id} room={room} tags={room.tags} />
    ))}
  </div>
);
