import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Event } from "@prisma/client";
import type { Character } from "~/types/timeline";

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
  const [characterId, setCharacterId] = useState<string>(
    event?.characterId.toString() ?? "",
  );
  const [title, setTitle] = useState(event?.title ?? "");
  const [content, setContent] = useState(event?.content ?? "");
  const [startTime, setStartTime] = useState<Date>(
    event?.startTime ?? new Date(),
  );
  const [endTime, setEndTime] = useState<Date>(event?.endTime ?? new Date());

  useEffect(() => {
    if (event) {
      setCharacterId(event.characterId.toString());
      setTitle(event.title);
      setContent(event.content);
      setStartTime(new Date(event.startTime));
      setEndTime(new Date(event.endTime));
    }
  }, [event]);

  const handleSubmit = () => {
    onSubmit({
      characterId: Number(characterId),
      title,
      content,
      startTime,
      endTime,
      timelineId: event?.timelineId ?? 0,
      createdAt: event?.createdAt ?? new Date(),
      updatedAt: new Date(),
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
            <SelectItem key={character.id} value={character.id.toString()}>
              {character.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="イベントタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-gray-700 text-white border-gray-600"
      />
      <Textarea
        placeholder="イベント内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-gray-700 text-white border-gray-600"
        rows={3}
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
      <Button onClick={handleSubmit}>{event ? "更新" : "追加"}</Button>
    </div>
  );
};
