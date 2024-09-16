import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Character } from "~/hooks/useTimelineData";

interface EventFormProps {
  characters: Character[];
  characterId: string;
  action: string;
  startTime: Date;
  endTime: Date;
  onCharacterChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onStartTimeChange: (value: Date) => void;
  onEndTimeChange: (value: Date) => void;
  onSubmit: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  characters,
  characterId,
  action,
  startTime,
  endTime,
  onCharacterChange,
  onActionChange,
  onStartTimeChange,
  onEndTimeChange,
  onSubmit,
}) => {
  const formatTimeForInput = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleTimeChange =
    (setter: (date: Date) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [hours = 0, minutes = 0] = e.target.value.split(":").map(Number);
      const newDate = new Date(startTime);
      newDate.setHours(hours, minutes);
      setter(newDate);
    };

  return (
    <div className="space-y-4">
      <Select value={characterId} onValueChange={onCharacterChange}>
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
        onChange={(e) => onActionChange(e.target.value)}
        className="bg-gray-700 text-white border-gray-600"
      />
      <div className="flex space-x-2">
        <Input
          type="time"
          value={formatTimeForInput(startTime)}
          onChange={handleTimeChange(onStartTimeChange)}
          className="bg-gray-700 text-white border-gray-600"
        />
        <Input
          type="time"
          value={formatTimeForInput(endTime)}
          onChange={handleTimeChange(onEndTimeChange)}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
      <Button onClick={onSubmit}>イベントを追加</Button>
    </div>
  );
};
