import type React from "react";
import { Switch } from "@/components/ui/switch";
import type { CharacterWithVisibility } from "~/types/timeline";

interface CharacterVisibilityToggleProps {
  characters: CharacterWithVisibility[];
  toggleVisibility: (characterId: number) => void;
}

export const CharacterVisibilityToggle: React.FC<
  CharacterVisibilityToggleProps
> = ({ characters, toggleVisibility }) => (
  <>
    {characters.map((character) => (
      <div
        key={character.id}
        className="flex items-center justify-between space-x-2 p-2 bg-gray-700 rounded-md"
      >
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${character.color}`}
            style={{ backgroundColor: character.color }}
          />
          <span className="text-sm font-medium whitespace-nowrap">
            {character.name}
          </span>
        </div>
        <Switch
          checked={character.isVisible}
          onCheckedChange={() => toggleVisibility(character.id)}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    ))}
  </>
);
