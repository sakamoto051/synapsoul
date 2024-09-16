// CharacterForm.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CharacterFormProps {
  name: string;
  color: string;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSubmit: () => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({
  name,
  color,
  onNameChange,
  onColorChange,
  onSubmit,
}) => (
  <div className="space-y-2">
    <Input
      placeholder="キャラクター名"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      className="bg-gray-700 text-white border-gray-600"
    />
    <Select value={color} onValueChange={onColorChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Color" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bg-red-500">Red</SelectItem>
        <SelectItem value="bg-blue-500">Blue</SelectItem>
        <SelectItem value="bg-green-500">Green</SelectItem>
        <SelectItem value="bg-yellow-500">Yellow</SelectItem>
        <SelectItem value="bg-purple-500">Purple</SelectItem>
        <SelectItem value="bg-pink-500">Pink</SelectItem>
        <SelectItem value="bg-indigo-500">Indigo</SelectItem>
      </SelectContent>
    </Select>
    <Button onClick={onSubmit} className="w-full">
      キャラクターを追加
    </Button>
  </div>
);
