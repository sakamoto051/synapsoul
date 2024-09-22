import type React from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { CharacterManager } from "./CharacterManager";
import { EventManager } from "./EventManager";
import { TimelineGrid } from "./TimelineGrid";
import type { TimelineData } from "~/hooks/useTimelineData";
import { CharacterVisibilityToggle } from "./CharacterVisibilityToggle";
import type { Character } from "~/types/timeline";
import type { Event } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimelinePageProps {
  timelineData: TimelineData;
  setTimelineData: React.Dispatch<React.SetStateAction<TimelineData>>;
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
  setTimelineData,
  visibleCharacters,
  onSave,
  onAddOrUpdateCharacter,
  onDeleteCharacter,
  onAddOrUpdateEvent,
  onDeleteEvent,
  toggleCharacterVisibility,
}) => {
  const params = useParams();
  const isbn = params.isbn as string;

  const handleEditEvent = (updatedEvent: Event) => {
    setTimelineData((prevData) => ({
      ...prevData,
      events: prevData.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    }));
    onAddOrUpdateEvent(updatedEvent);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col space-y-4 mb-6">
        <Link href={`/books/${isbn}/timelines`} passHref>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            タイムライン一覧に戻る
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-2">
          <CharacterManager
            characters={timelineData.characters}
            onAddOrUpdateCharacter={onAddOrUpdateCharacter}
            onDeleteCharacter={onDeleteCharacter}
          />

          <EventManager
            characters={visibleCharacters}
            onAddOrUpdateEvent={onAddOrUpdateEvent}
          />
          <Button
            onClick={onSave}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border mb-4">
        <div className="flex w-max space-x-2 p-2">
          <CharacterVisibilityToggle
            characters={timelineData.characters}
            toggleVisibility={toggleCharacterVisibility}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TimelineGrid
        characters={visibleCharacters}
        events={timelineData.events}
        onEditEvent={handleEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
