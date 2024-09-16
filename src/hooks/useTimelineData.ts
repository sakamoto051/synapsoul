import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

export interface Character {
  id: string;
  name: string;
  color: string;
}

export interface Event {
  id: string;
  characterId: string;
  action: string;
  startTime: Date;
  endTime: Date;
}

export interface TimelineData {
  id: number;
  title: string;
  characters: Character[];
  events: Event[];
}

export const useTimelineData = (timelineId: number) => {
  const [timelineData, setTimelineData] = useState<TimelineData>({
    id: timelineId,
    title: "Untitled Timeline",
    characters: [],
    events: [],
  });

  const { toast } = useToast();

  const { data: timeline, isLoading } = api.timeline.getById.useQuery(
    { id: timelineId },
    {
      enabled: !!timelineId,
    },
  );

  useEffect(() => {
    if (timeline) {
      setTimelineData({
        id: timeline.id,
        title: timeline.title,
        characters: timeline.characters.map((char) => ({
          ...char,
          id: char.id.toString(),
        })),
        events: timeline.events.map((event) => ({
          ...event,
          id: event.id.toString(),
          characterId: event.characterId.toString(),
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        })),
      });
    }
  }, [timeline]);

  const saveTimelineMutation = api.timeline.saveTimeline.useMutation({
    onSuccess: () => {
      toast({
        title: "タイムラインを保存しました",
        description: "タイムラインが正常に保存されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `タイムラインの保存中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveTimeline = () => {
    // Convert Date objects to ISO strings before saving
    const dataToSave = {
      ...timelineData,
      events: timelineData.events.map((event) => ({
        ...event,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
      })),
    };
    saveTimelineMutation.mutate(dataToSave);
  };

  const handleAddOrUpdateCharacter = (newCharacter: Omit<Character, "id">) => {
    setTimelineData((prev) => {
      const existingIndex = prev.characters.findIndex(
        (char) => char.name === newCharacter.name,
      );
      if (existingIndex >= 0) {
        return {
          ...prev,
          characters: prev.characters.map((char, index) =>
            index === existingIndex ? { ...char, ...newCharacter } : char,
          ),
        };
      }
      return {
        ...prev,
        characters: [
          ...prev.characters,
          { ...newCharacter, id: Date.now().toString() },
        ],
      };
    });
  };

  const handleDeleteCharacter = (id: string) => {
    setTimelineData((prev) => ({
      ...prev,
      characters: prev.characters.filter((char) => char.id !== id),
      events: prev.events.filter((event) => event.characterId !== id),
    }));
  };

  const handleAddOrUpdateEvent = (newEvent: Omit<Event, "id">) => {
    setTimelineData((prev) => {
      const existingIndex = prev.events.findIndex(
        (event) =>
          event.characterId === newEvent.characterId &&
          event.startTime.getTime() === newEvent.startTime.getTime() &&
          event.endTime.getTime() === newEvent.endTime.getTime(),
      );
      if (existingIndex >= 0) {
        return {
          ...prev,
          events: prev.events.map((event, index) =>
            index === existingIndex
              ? { ...event, ...newEvent, id: event.id }
              : event,
          ),
        };
      }
      const newEventWithId: Event = {
        ...newEvent,
        id: Date.now().toString(),
      };
      return {
        ...prev,
        events: [...prev.events, newEventWithId],
      };
    });
  };

  const handleDeleteEvent = (id: string) => {
    setTimelineData((prev) => ({
      ...prev,
      events: prev.events.filter((event) => event.id !== id),
    }));
  };

  return {
    timelineData,
    isLoading,
    setTimelineData,
    handleSaveTimeline,
    handleAddOrUpdateCharacter,
    handleDeleteCharacter,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
  };
};
