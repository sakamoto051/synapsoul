// src/app/books/[isbn]/timelines/[id]/EventManager.tsx

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import type { Character, Event } from "~/hooks/useTimelineData";
import { Button } from "~/components/ui/button";

interface EventManagerProps {
  characters: Character[];
  onAddOrUpdateEvent: (event: Omit<Event, "id">) => void;
}

export const EventManager: React.FC<EventManagerProps> = ({
  characters,
  onAddOrUpdateEvent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleSubmit = (event: Omit<Event, "id">) => {
    onAddOrUpdateEvent(event);
    setEditingEvent(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          イベント追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? "イベント編集" : "イベント追加"}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          characters={characters}
          event={editingEvent}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
