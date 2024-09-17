import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CharacterList } from "./CharacterList";
import { CharacterForm } from "./CharacterForm";
import type { Character } from "~/hooks/useTimelineData";

interface CharacterManagerProps {
  characters: Character[];
  onAddOrUpdateCharacter: (character: Omit<Character, "id">) => void;
  onDeleteCharacter: (id: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CharacterManager: React.FC<CharacterManagerProps> = ({
  characters,
  onAddOrUpdateCharacter,
  onDeleteCharacter,
  isOpen,
  setIsOpen,
}) => {
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null,
  );

  const handleSubmit = (character: Omit<Character, "id">) => {
    onAddOrUpdateCharacter(character);
    setEditingCharacter(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 bg-purple-600 hover:bg-purple-700">
          キャラクター管理
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>キャラクター管理</DialogTitle>
        </DialogHeader>
        <CharacterList
          characters={characters}
          onEdit={(char) => setEditingCharacter(char)}
          onDelete={onDeleteCharacter}
        />
        <CharacterForm character={editingCharacter} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
