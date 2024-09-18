import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";
import type { Character } from "~/types/timeline";

interface CharacterFormProps {
  character: Character | null;
  timelineGroupId: number;
  onSubmit: (character: Omit<Character, "id">) => void;
  onCancel: () => void;
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
  character,
  timelineGroupId,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(character?.name ?? "");
  const [color, setColor] = useState(character?.color ?? "bg-gray-500");

  useEffect(() => {
    if (character) {
      setName(character.name);
      setColor(character.color);
    } else {
      setName("");
      setColor("bg-gray-500");
    }
  }, [character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, color, timelineGroupId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="character-name"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          キャラクター名
        </label>
        <Input
          id="character-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="character-color"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          キャラクターの色
        </label>
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger
            id="character-color"
            className="w-full bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
          >
            <SelectValue placeholder="色を選択" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.hex }}
                  />
                  <span className="text-white">{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 py-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
        >
          <X className="mr-2 h-4 w-4" />
          キャンセル
        </Button>
        <Button
          type="submit"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {character ? "更新" : "追加"}
        </Button>
      </div>
    </form>
  );
};
