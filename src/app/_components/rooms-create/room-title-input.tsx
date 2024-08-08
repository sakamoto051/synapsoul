import React from 'react';
import { Input } from "@/components/ui/input";

interface RoomTitleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoomTitleInput: React.FC<RoomTitleInputProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="roomTitle" className="block mb-2">Room Name</label>
    <Input
      id="roomTitle"
      value={value}
      onChange={onChange}
      className="w-full bg-gray-700 border-none"
      placeholder="Enter room name"
    />
  </div>
);

export default RoomTitleInput;
