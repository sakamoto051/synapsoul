import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CharacterManager } from "./CharacterManager";
import { EventManager } from "./EventManager";
import { TimelineGrid } from "./TimelineGrid";
import type { TimelineData, Character, Event } from "~/hooks/useTimelineData";

interface TimelinePageProps {
  timelineData: TimelineData;
  setTimelineData: React.Dispatch<React.SetStateAction<TimelineData>>;
  onSave: () => void;
  onAddOrUpdateCharacter: (character: Omit<Character, "id">) => void;
  onDeleteCharacter: (id: string) => void;
  onAddOrUpdateEvent: (event: Omit<Event, "id">) => void;
  onDeleteEvent: (id: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  timelineData,
  setTimelineData,
  onSave,
  onAddOrUpdateCharacter,
  onDeleteCharacter,
  onAddOrUpdateEvent,
  onDeleteEvent,
}) => {
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={timelineData.title}
          onChange={(e) =>
            setTimelineData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-2xl font-bold text-blue-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md"
        />
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>
      </div>

      <div className="mb-2">
        <CharacterManager
          characters={timelineData.characters}
          onAddOrUpdateCharacter={onAddOrUpdateCharacter}
          onDeleteCharacter={onDeleteCharacter}
          isOpen={isCharacterDialogOpen}
          setIsOpen={setIsCharacterDialogOpen}
        />

        <EventManager
          characters={timelineData.characters}
          onAddOrUpdateEvent={onAddOrUpdateEvent}
          isOpen={isEventDialogOpen}
          setIsOpen={setIsEventDialogOpen}
          setIsEventDialogOpen={setIsEventDialogOpen}
        />
      </div>

      <TimelineGrid
        characters={timelineData.characters}
        events={timelineData.events}
        onEditEvent={(event) => {
          onAddOrUpdateEvent(event);
          setIsEventDialogOpen(true);
        }}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
