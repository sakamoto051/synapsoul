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

const colorOptions = [
  { value: "bg-red-500", label: "Red", hex: "#ef4444" },
  { value: "bg-blue-500", label: "Blue", hex: "#3b82f6" },
  { value: "bg-green-500", label: "Green", hex: "#22c55e" },
  { value: "bg-yellow-500", label: "Yellow", hex: "#eab308" },
  { value: "bg-purple-500", label: "Purple", hex: "#a855f7" },
  { value: "bg-pink-500", label: "Pink", hex: "#ec4899" },
  { value: "bg-indigo-500", label: "Indigo", hex: "#6366f1" },
];

export const CharacterForm: React.FC<CharacterFormProps> = ({
  name,
  color,
  onNameChange,
  onColorChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="character-name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          キャラクター名
        </label>
        <Input
          id="character-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div>
        <label
          htmlFor="character-color"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          キャラクターの色
        </label>
        <Select value={color} onValueChange={onColorChange}>
          <SelectTrigger
            id="character-color"
            className="w-full bg-gray-700 border-gray-600 text-white"
          >
            <div className="flex items-center">
              <SelectValue placeholder="色を選択" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center justify-between w-full space-x-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: option.hex }}
                  />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        キャラクターを追加
      </Button>
    </div>
  );
};
