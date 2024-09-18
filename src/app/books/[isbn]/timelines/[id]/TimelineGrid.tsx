import type React from "react";
import { EventCard } from "./EventCard";
import type { Character, Event } from "~/hooks/useTimelineData";
import { uniqueId } from "lodash";

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
  const getEventPosition = (time: Date) => {
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    return (totalMinutes / 1440) * 100; // 1440 minutes in a day
  };

  const getEventHeight = (startTime: Date, endTime: Date) => {
    const start = getEventPosition(startTime);
    const end = getEventPosition(endTime);
    return end - start;
  };

  return (
    <div className="flex">
      {characters.map((character) => (
        <div key={character.id} className="flex-1 mr-1 last:mr-0">
          <h2
            className={`text-center p-2 ${character.color} text-white rounded-t-lg`}
          >
            {character.name}
          </h2>
          <div className="relative h-[600px] bg-gray-800 border border-gray-600 rounded-b-lg overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={uniqueId()}
                className="absolute w-full border-t border-gray-600 text-xs text-gray-400"
                style={{ top: `${(i / 24) * 100}%` }}
              >
                {i}:00
              </div>
            ))}
            {events
              .filter((event) => event.characterId === character.id.toString())
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  characterColor={character.color}
                  onEdit={() => onEditEvent(event)}
                  onDelete={() => onDeleteEvent(event.id)}
                  top={`${getEventPosition(event.startTime)}%`}
                  height={`${getEventHeight(event.startTime, event.endTime)}%`}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
