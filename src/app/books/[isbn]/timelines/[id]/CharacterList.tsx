// src/app/books/[isbn]/timelines/CharacterList.tsx

import type React from "react";
import type { Character } from "~/types/timeline";

interface CharacterListProps {
  characters: Character[];
}

export const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">キャラクター一覧</h3>
      {characters.length === 0 ? (
        <p className="text-gray-400">キャラクターがまだ作成されていません。</p>
      ) : (
        <ul className="space-y-2">
          {characters.map((character) => (
            <li
              key={character.id}
              className="flex items-center space-x-2 p-2 bg-gray-700 rounded"
            >
              <div className={`w-4 h-4 rounded-full ${character.color}`} />
              <span>{character.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
