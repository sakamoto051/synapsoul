import React from 'react';
import SearchAndFilter from '../_components/rooms/search-filter-create';
import RoomCard from '../_components/rooms/room-card';
import { api } from "~/trpc/server";

const MainPage = async () => {
  const rooms = await api.room.list();

  return (
    <div>
      <SearchAndFilter />
      <div className="grid grid-cols-3 gap-4">
        {rooms.map((room, index) => (
          <RoomCard key={index} name={room.title} details={room.content} tags={room.tags} createdAt={room.createdAt} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;