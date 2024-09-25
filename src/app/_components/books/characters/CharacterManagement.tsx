"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import CharacterDetail from "./CharacterDetail";
import type { Character } from "@prisma/client";
import CharacterList from "./CharacterList";

interface CharacterManagementProps {
  isbn: string;
}

const CharacterManagement: React.FC<CharacterManagementProps> = ({ isbn }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { data: bookData } = api.book.getByIsbn.useQuery({ isbn });
  const { data: characterData, refetch: refetchCharacters } =
    api.character.getByBookId.useQuery(
      { bookId: bookData?.id ?? 0 },
      { enabled: !!bookData?.id },
    );

  useEffect(() => {
    if (characterData) {
      setCharacters(characterData);
    }
  }, [characterData]);

  const handleAddNewCharacter = () => {
    setSelectedCharacter(null);
    setIsAddingNew(true);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setIsAddingNew(false);
  };

  const handleCharacterSave = () => {
    refetchCharacters();
    setSelectedCharacter(null);
    setIsAddingNew(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-300">
            キャラクター一覧
          </h2>
          {bookData && (
            <Button
              onClick={handleAddNewCharacter}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              新規キャラクター
            </Button>
          )}
        </div>
        <CharacterList
          characters={characters}
          onCharacterSelect={handleCharacterSelect}
          selectedCharacterId={selectedCharacter?.id}
          bookId={bookData?.id ?? null}
        />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">
          {isAddingNew ? "新規キャラクター" : "キャラクター詳細"}
        </h2>
        {(selectedCharacter ?? isAddingNew) && (
          <CharacterDetail
            character={selectedCharacter}
            bookId={bookData?.id ?? 0}
            onSave={handleCharacterSave}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterManagement;
