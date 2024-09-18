// src/app/books/[isbn]/timelines/[id]/TimelinePage.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CharacterManager } from "./CharacterManager";
import { EventManager } from "./EventManager";
import { TimelineGrid } from "./TimelineGrid";
import type { TimelineData, Character, Event } from "~/hooks/useTimelineData";

interface TimelinePageProps {
  timelineData: TimelineData;
  onSave: () => Promise<void>;
  onAddOrUpdateCharacter: (character: Omit<Character, "id">) => Promise<void>;
  onDeleteCharacter: (id: number) => Promise<void>;
  onAddOrUpdateEvent: (event: Omit<Event, "id">) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  timelineData,
  onSave,
  onAddOrUpdateCharacter,
  onDeleteCharacter,
  onAddOrUpdateEvent,
  onDeleteEvent,
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
          timelineGroupId={timelineData.timelineGroupId}
          characters={timelineData.characters}
          onAddOrUpdateCharacter={onAddOrUpdateCharacter}
          onDeleteCharacter={onDeleteCharacter}
        />

        <EventManager
          characters={timelineData.characters}
          onAddOrUpdateEvent={onAddOrUpdateEvent}
        />
      </div>

      <TimelineGrid
        characters={timelineData.characters}
        events={timelineData.events}
        onEditEvent={onAddOrUpdateEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
