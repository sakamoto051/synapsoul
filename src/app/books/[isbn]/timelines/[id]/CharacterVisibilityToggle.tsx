import type React from "react";
import { Switch } from "@/components/ui/switch";
import type { Character } from "~/types/timeline";

interface CharacterVisibilityToggleProps {
  characters: Character[];
  toggleVisibility: (characterId: number) => void;
}

export const CharacterVisibilityToggle: React.FC<
  CharacterVisibilityToggleProps
> = ({ characters, toggleVisibility }) => {
  return (
    <div className="flex gap-2 mb-2">
      {characters.map((character) => (
        <div
          key={character.id}
          className="flex items-center justify-between space-x-2 p-2 bg-gray-700 rounded-md"
        >
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${character.color}`} />
            <span className="text-sm font-medium">{character.name}</span>
          </div>
          <Switch
            checked={character.isVisible}
            onCheckedChange={() => toggleVisibility(character.id)}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      ))}
    </div>
  );
};
