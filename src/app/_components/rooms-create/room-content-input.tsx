import type React from "react";

interface RoomContentInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const RoomContentInput: React.FC<RoomContentInputProps> = ({
  value,
  onChange,
}) => (
  <div>
    <label htmlFor="roomContent" className="block mb-2">
      Room Details
    </label>
    <textarea
      id="roomContent"
      value={value}
      onChange={onChange}
      className="w-full h-32 bg-gray-700 text-white rounded-md p-2 border-none"
      placeholder="Enter room details"
    />
  </div>
);

export default RoomContentInput;
