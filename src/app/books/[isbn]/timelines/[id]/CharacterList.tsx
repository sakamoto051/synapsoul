// CharacterList.tsx
import type React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface Character {
  id: string;
  name: string;
  color: string;
}

interface CharacterListProps {
  characters: Character[];
  onEdit: (character: Character) => void;
  onDelete: (id: string) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onEdit,
  onDelete,
}) => (
  <div className="space-y-2">
    {characters.map((character) => (
      <div key={character.id} className="flex items-center justify-between">
        <div className={`w-6 h-6 rounded-full ${character.color}`} />
        <span>{character.name}</span>
        <div>
          <Button size="sm" variant="ghost" onClick={() => onEdit(character)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(character.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);
