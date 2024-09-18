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
import { CharacterForm } from "./CharacterForm";
import { Trash2, UserPlus, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Character } from "~/types/timeline";

interface CharacterManagerProps {
  timelineGroupId: number;
  characters: Character[];
  onAddOrUpdateCharacter: (character: Omit<Character, "id">) => Promise<void>;
  onDeleteCharacter: (id: number) => Promise<void>;
}

export const CharacterManager: React.FC<CharacterManagerProps> = ({
  timelineGroupId,
  characters,
  onAddOrUpdateCharacter,
  onDeleteCharacter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (character: Omit<Character, "id">) => {
    await onAddOrUpdateCharacter(character);
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    await onDeleteCharacter(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Users className="mr-2 h-4 w-4" />
          キャラクター管理
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-300">
            キャラクター管理
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isAdding ? (
            <CharacterForm
              character={null}
              onSubmit={handleSubmit}
              timelineGroupId={timelineGroupId}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <Button
              onClick={() => setIsAdding(true)}
              className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              新しいキャラクターを追加
            </Button>
          )}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="flex items-center justify-between px-3 bg-gray-700 rounded-lg transition-colors hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${character.color}`}
                    />
                    <span className="font-medium">{character.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(character.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
