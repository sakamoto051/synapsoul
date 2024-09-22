import type React from "react";
import { useState, useMemo, useCallback } from "react";
import { EventCard } from "./EventCard";
import { uniqueId } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "./EventForm";
import type { Event } from "@prisma/client";
import type { Character } from "~/types/timeline";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimelineGridProps {
  characters: Character[];
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: number) => void;
}

interface PositionedEvent extends Event {
  left: string;
  width: string;
  top: string;
  height: string;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({
  characters,
  events,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getEventPosition = useCallback((time: Date) => {
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    return (totalMinutes / 1440) * 100; // 1440 minutes in a day
  }, []);

  const getEventHeight = useCallback(
    (startTime: Date, endTime: Date) => {
      const start = getEventPosition(startTime);
      const end = getEventPosition(endTime);
      return Math.max(end - start, 1.04); // Ensure a minimum height of 1.04% (15 minutes)
    },
    [getEventPosition],
  );

  const positionEvents = useCallback(
    (characterEvents: Event[]): PositionedEvent[] => {
      const sortedEvents = [...characterEvents].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      );
      const positionedEvents: PositionedEvent[] = [];

      for (const event of sortedEvents) {
        const overlappingEvents = positionedEvents.filter(
          (e) =>
            (event.startTime < e.endTime && event.endTime > e.startTime) ||
            (e.startTime < event.endTime && e.endTime > event.startTime),
        );

        const availableWidth = 100 / (overlappingEvents.length + 1);
        const left = overlappingEvents.length * availableWidth;

        positionedEvents.push({
          ...event,
          left: `${left}%`,
          width: `${availableWidth}%`,
          top: `${getEventPosition(event.startTime)}%`,
          height: `${getEventHeight(event.startTime, event.endTime)}%`,
        });
      }

      return positionedEvents;
    },
    [getEventPosition, getEventHeight],
  );

  const groupedEventsByCharacter = useMemo(() => {
    return characters.reduce(
      (acc, character) => {
        const characterEvents = events.filter(
          (event) => event.characterId === character.id,
        );
        acc[character.id] = positionEvents(characterEvents);
        return acc;
      },
      {} as Record<number, PositionedEvent[]>,
    );
  }, [characters, events, positionEvents]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  const handleEventUpdate = (updatedEvent: Omit<Event, "id">) => {
    if (selectedEvent) {
      onEditEvent({ ...updatedEvent, id: selectedEvent.id });
      setSelectedEvent(null);
      setIsEditing(false);
    }
  };

  const renderTimeColumn = () => (
    <div className="w-10 flex-shrink-0 sticky left-0 z-20 bg-gray-900">
      <div className="relative h-[1440px]">
        {Array.from({ length: 97 }).map((_, i) => (
          <div
            key={uniqueId()}
            className={`absolute w-full text-xs text-gray-400 text-right pr-2 ${
              i % 4 === 0 ? "font-bold" : ""
            }`}
            style={{ top: `${(i / 96) * 100}%` }}
          >
            {i % 4 === 0 && `${Math.floor(i / 4)}:00`}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCharacterColumns = () => (
    <>
      <div className="flex sticky top-0 z-10 bg-gray-900">
        <div className="w-10 flex-shrink-0" />
        {characters.map((character) => (
          <div
            key={character.id}
            className="flex-1 mr-1 last:mr-0 min-w-[150px] sm:min-w-[200px]"
          >
            <h2
              className={`text-center p-2 ${character.color} text-white rounded-t-lg text-sm sm:text-base`}
            >
              {character.name}
            </h2>
          </div>
        ))}
      </div>
      <div className="flex">
        {renderTimeColumn()}
        {characters.map((character) => (
          <div
            key={character.id}
            className="flex-1 mr-1 last:mr-0 min-w-[150px] sm:min-w-[200px]"
          >
            <div className="relative h-[1440px] bg-gray-800 border border-gray-600 rounded-b-lg overflow-hidden">
              {Array.from({ length: 97 }).map((_, i) => (
                <div
                  key={uniqueId()}
                  className={`absolute w-full border-t ${
                    i % 4 === 0 ? "border-gray-500" : "border-gray-700"
                  }`}
                  style={{ top: `${(i / 96) * 100}%` }}
                />
              ))}
              {groupedEventsByCharacter[character.id]?.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  characterColor={character.color}
                  onClick={() => handleEventClick(event)}
                  top={event.top}
                  height={event.height}
                  left={event.left}
                  width={event.width}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-200px)]">
      <ScrollArea className="flex-grow w-[calc(100vw-200px)]">
        {renderCharacterColumns()}
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "イベントを編集" : "イベント詳細"}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && !isEditing && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedEvent.title}
              </h3>
              <p className="mb-4">{selectedEvent.content}</p>
              <p>
                <strong>開始時間:</strong>{" "}
                {selectedEvent.startTime.toLocaleTimeString()}
              </p>
              <p>
                <strong>終了時間:</strong>{" "}
                {selectedEvent.endTime.toLocaleTimeString()}
              </p>
            </div>
          )}
          {isEditing && selectedEvent && (
            <EventForm
              characters={characters}
              event={selectedEvent}
              onSubmit={handleEventUpdate}
            />
          )}
          <DialogFooter>
            {!isEditing && (
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="default" onClick={handleEditClick}>
                  編集
                </Button>
                <Button variant="destructive" onClick={handleDeleteClick}>
                  削除
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
