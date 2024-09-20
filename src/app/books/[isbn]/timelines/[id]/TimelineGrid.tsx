import type React from "react";
import { useState } from "react";
import { EventCard } from "./EventCard";
import type { Character, Event } from "~/hooks/useTimelineData";
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

interface TimelineGridProps {
  characters: Character[];
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({
  characters,
  events,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getEventPosition = (time: Date) => {
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    return (totalMinutes / 1440) * 100; // 1440 minutes in a day
  };

  const getEventHeight = (startTime: Date, endTime: Date) => {
    const start = getEventPosition(startTime);
    const end = getEventPosition(endTime);
    return end - start;
  };

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

  return (
    <div className="flex">
      {/* Time column */}
      <div className="w-16 mr-2">
        <div className="h-10" /> {/* Space for character names */}
        <div className="relative h-[600px]">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={uniqueId()}
              className="absolute w-full text-xs text-gray-400 text-right pr-2"
              style={{ top: `${(i / 24) * 100}%` }}
            >
              {i}:00
            </div>
          ))}
        </div>
      </div>

      {/* Character columns */}
      {characters.map((character) => (
        <div key={character.id} className="flex-1 mr-1 last:mr-0">
          <h2
            className={`text-center p-2 ${character.color} text-white rounded-t-lg`}
          >
            {character.name}
          </h2>
          <div className="relative h-[600px] bg-gray-800 border border-gray-600 rounded-b-lg overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={uniqueId()}
                className="absolute w-full border-t border-gray-600"
                style={{ top: `${(i / 24) * 100}%` }}
              />
            ))}
            {events
              .filter((event) => event.characterId === character.id.toString())
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  characterColor={character.color}
                  onClick={() => handleEventClick(event)}
                  top={`${getEventPosition(event.startTime)}%`}
                  height={`${getEventHeight(event.startTime, event.endTime)}%`}
                />
              ))}
          </div>
        </div>
      ))}

      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent>
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
              <div className="flex justify-end space-x-2">
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
