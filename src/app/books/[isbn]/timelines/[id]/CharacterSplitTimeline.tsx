import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CharacterList } from "./CharacterList";
import { TimelineGrid } from "./TimelineGrid";
import { EventCard } from "./EventCard";
import { CharacterForm } from "./CharacterForm";
import { EventForm } from "./EventForm";
import type { TimelineData, Character, Event } from "~/hooks/useTimelineData";

interface CharacterSplitTimelineProps {
  timelineData: TimelineData;
  setTimelineData: React.Dispatch<React.SetStateAction<TimelineData>>;
  onSave: () => void;
  onAddOrUpdateCharacter: (character: Omit<Character, "id">) => void;
  onDeleteCharacter: (id: string) => void;
  onAddOrUpdateEvent: (event: Omit<Event, "id">) => void;
  onDeleteEvent: (id: string) => void;
}

export const CharacterSplitTimeline: React.FC<CharacterSplitTimelineProps> = ({
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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newCharacter, setNewCharacter] = useState<Omit<Character, "id">>({
    name: "",
    color: "bg-gray-500",
  });
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    characterId: "",
    action: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  // Helper functions
  const getEventPosition = (time: Date) => {
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    return (totalMinutes / 1440) * 100; // 1440 minutes in a day
  };

  const getEventHeight = (startTime: Date, endTime: Date) => {
    const start = getEventPosition(startTime);
    const end = getEventPosition(endTime);
    return end - start;
  };

  const handleAddEvent = () => {
    if (newEvent.characterId && newEvent.action) {
      onAddOrUpdateEvent(newEvent);
      setNewEvent({
        characterId: "",
        action: "",
        startTime: new Date(),
        endTime: new Date(),
      });
      setIsEventDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title and save button */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={timelineData.title}
          onChange={(e) =>
            setTimelineData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="text-2xl font-bold text-blue-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md"
        />
        <div className="space-x-2">
          <Dialog
            open={isCharacterDialogOpen}
            onOpenChange={setIsCharacterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Settings className="mr-2 h-4 w-4" />
                キャラクター管理
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>キャラクター管理</DialogTitle>
              </DialogHeader>
              <CharacterList
                characters={timelineData.characters}
                onEdit={(char) => {
                  setNewCharacter({ name: char.name, color: char.color });
                  setIsCharacterDialogOpen(true);
                }}
                onDelete={onDeleteCharacter}
              />
              <CharacterForm
                name={newCharacter.name}
                color={newCharacter.color}
                onNameChange={(name) =>
                  setNewCharacter({ ...newCharacter, name })
                }
                onColorChange={(color) =>
                  setNewCharacter({ ...newCharacter, color })
                }
                onSubmit={() => {
                  onAddOrUpdateCharacter(newCharacter);
                  setNewCharacter({ name: "", color: "bg-gray-500" });
                  setIsCharacterDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="flex">
        {timelineData.characters.map((character) => (
          <div key={character.id} className="flex-1 mr-1 last:mr-0">
            <h2
              className={`text-center p-2 ${character.color} text-white rounded-t-lg`}
            >
              {character.name}
            </h2>
            <TimelineGrid>
              {timelineData.events
                .filter((event) => event.characterId === character.id)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    characterColor={character.color}
                    onEdit={() => {
                      setEditingEvent(event);
                      setNewEvent({
                        characterId: event.characterId,
                        action: event.action,
                        startTime: event.startTime,
                        endTime: event.endTime,
                      });
                      setIsEventDialogOpen(true);
                    }}
                    onDelete={() => onDeleteEvent(event.id)}
                    top={`${getEventPosition(event.startTime)}%`}
                    height={`${getEventHeight(event.startTime, event.endTime)}%`}
                  />
                ))}
            </TimelineGrid>
          </div>
        ))}
      </div>

      {/* Event dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "イベント編集" : "イベント追加"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            characters={timelineData.characters}
            characterId={newEvent.characterId}
            action={newEvent.action}
            startTime={newEvent.startTime}
            endTime={newEvent.endTime}
            onCharacterChange={(characterId) =>
              setNewEvent({ ...newEvent, characterId })
            }
            onActionChange={(action) => setNewEvent({ ...newEvent, action })}
            onStartTimeChange={(startTime) =>
              setNewEvent({ ...newEvent, startTime })
            }
            onEndTimeChange={(endTime) => setNewEvent({ ...newEvent, endTime })}
            onSubmit={handleAddEvent}
          />
        </DialogContent>
      </Dialog>

      {/* Add new event button */}
      <Button
        onClick={() => {
          setEditingEvent(null);
          setNewEvent({
            characterId: "",
            action: "",
            startTime: new Date(),
            endTime: new Date(),
          });
          setIsEventDialogOpen(true);
        }}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white"
      >
        イベント追加
      </Button>
    </div>
  );
};
