// src/app/_components/books/characters/CharacterList.tsx
import type React from "react";
import { Button } from "~/components/ui/button";
import type { Character } from "@prisma/client";

interface CharacterListProps {
  characters: Character[];
  onCharacterSelect: (character: Character) => void;
  selectedCharacterId?: number;
  bookId: number | null;
}

const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onCharacterSelect,
  selectedCharacterId,
  bookId,
}) => {
  return (
    <div className="space-y-2">
      {characters.map((character) => (
        <Button
          key={character.id}
          onClick={() => onCharacterSelect(character)}
          className={`w-full justify-start ${
            character.id === selectedCharacterId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: character.color }}
            />
            <span>{character.name}</span>
          </div>
        </Button>
      ))}
      {bookId ? (
        <>
          {characters.length === 0 && (
            <p className="text-gray-400 text-center">
              キャラクターがまだ登録されていません。
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center">
          本のステータスが設定されていません。
          <br />
          ステータスを設定するとキャラクターを追加できます。
        </p>
      )}
    </div>
  );
};

export default CharacterList;
