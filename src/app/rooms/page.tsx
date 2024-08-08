'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { api } from '~/trpc/react';
import RoomCard from '../_components/rooms/room-card';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

export const RoomSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const roomsQuery = api.room.list.useQuery();
  const router = useRouter();

  const filteredRooms = roomsQuery.data?.filter(room =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const handleCreateRoom = () => {
    router.push('/rooms/create');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 space-x-4">
        <Input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 border-none"
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors mr-4">
          TagFilter
        </button>
        <button
          onClick={handleCreateRoom}
          className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <PlusCircle size={24} />
          <span className="ml-2">Create</span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} tags={room.tags} />
        ))}
      </div>
    </div>
  );
};

export default RoomSearch;