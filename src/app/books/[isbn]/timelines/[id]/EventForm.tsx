import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Character, Event } from "~/hooks/useTimelineData";

interface EventFormProps {
  characters: Character[];
  event: Event | null;
  onSubmit: (event: Omit<Event, "id">) => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  characters,
  event,
  onSubmit,
}) => {
  const [characterId, setCharacterId] = useState(event?.characterId ?? "");
  const [action, setAction] = useState(event?.action ?? "");
  const [startTime, setStartTime] = useState<Date>(
    event?.startTime ?? new Date(),
  );
  const [endTime, setEndTime] = useState<Date>(event?.endTime ?? new Date());

  useEffect(() => {
    if (event) {
      setCharacterId(event.characterId);
      setAction(event.action);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    } else {
      setCharacterId("");
      setAction("");
      setStartTime(new Date());
      setEndTime(new Date());
    }
  }, [event]);

  const handleSubmit = () => {
    onSubmit({
      characterId,
      action,
      startTime,
      endTime,
    });
  };

  const formatTimeForInput = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleTimeChange =
    (setter: React.Dispatch<React.SetStateAction<Date>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [hours = 0, minutes = 0] = e.target.value.split(":").map(Number);
      const newDate = new Date(startTime);
      newDate.setHours(hours, minutes);
      setter(newDate);
    };

  return (
    <div className="space-y-4">
      <Select value={characterId} onValueChange={setCharacterId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="キャラクター選択" />
        </SelectTrigger>
        <SelectContent>
          {characters.map((character) => (
            <SelectItem key={character.id} value={character.id}>
              {character.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="イベント"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="bg-gray-700 text-white border-gray-600"
      />
      <div className="flex space-x-2">
        <Input
          type="time"
          value={formatTimeForInput(startTime)}
          onChange={handleTimeChange(setStartTime)}
          className="bg-gray-700 text-white border-gray-600"
        />
        <Input
          type="time"
          value={formatTimeForInput(endTime)}
          onChange={handleTimeChange(setEndTime)}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <Button onClick={handleSubmit}>
        {event ? "イベントを更新" : "イベントを追加"}
      </Button>
    </div>
  );
};
