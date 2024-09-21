import type React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CharacterManager } from "./CharacterManager";
import { EventManager } from "./EventManager";
import { TimelineGrid } from "./TimelineGrid";
import type { TimelineData } from "~/hooks/useTimelineData";
import { CharacterVisibilityToggle } from "./CharacterVisibilityToggle";
import type { Character } from "~/types/timeline";
import type { Event } from "@prisma/client";

interface TimelinePageProps {
  timelineData: TimelineData;
  visibleCharacters: Character[];
  onSave: () => Promise<void>;
  onAddOrUpdateCharacter: (
    character: Omit<Character, "id" | "isVisible" | "bookId">,
  ) => Promise<void>;
  onDeleteCharacter: (id: number) => Promise<void>;
  onAddOrUpdateEvent: (event: Omit<Event, "id">) => Promise<void>;
  onDeleteEvent: (id: number) => Promise<void>;
  toggleCharacterVisibility: (characterId: number) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  timelineData,
  visibleCharacters,
  onSave,
  onAddOrUpdateCharacter,
  onDeleteCharacter,
  onAddOrUpdateEvent,
  onDeleteEvent,
  toggleCharacterVisibility,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>
      </div>

      <div className="flex space-x-2 mb-2">
        <CharacterManager
          characters={timelineData.characters}
          onAddOrUpdateCharacter={onAddOrUpdateCharacter}
          onDeleteCharacter={onDeleteCharacter}
        />

        <EventManager
          characters={visibleCharacters}
          onAddOrUpdateEvent={onAddOrUpdateEvent}
        />
      </div>

      <CharacterVisibilityToggle
        characters={timelineData.characters}
        toggleVisibility={toggleCharacterVisibility}
      />

      <TimelineGrid
        characters={visibleCharacters}
        events={timelineData.events}
        onEditEvent={onAddOrUpdateEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
