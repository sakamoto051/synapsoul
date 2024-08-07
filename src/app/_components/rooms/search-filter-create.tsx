'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { PlusCircle } from 'lucide-react';

const SearchFilterCreate = () => {
  const router = useRouter();

  const handleCreateRoom = () => {
    router.push('/rooms/create');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex-grow mr-4">
        <Input
          type="text"
          placeholder="search"
          className="w-full bg-gray-700 text-white rounded-full px-4 py-2"
        />
      </div>
      <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors mr-4">
        TagFilter
      </button>
      <button
        onClick={handleCreateRoom}
        className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors flex items-center justify-center"
      >
        <PlusCircle size={24} />
        <span className="ml-2">Create Room</span>
      </button>
    </div>
  );
};

export default SearchFilterCreate;