// src/hooks/useTimelineData.ts

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
  date: Date;
  characters: Character[];
  events: Event[];
}

export const useTimelineData = (timelineId: number) => {
  const [localTimelineData, setLocalTimelineData] = useState<TimelineData>({
    id: timelineId,
    date: new Date(),
    characters: [],
    events: [],
  });

  const { toast } = useToast();

  const { data: fetchedTimelineData, isLoading: isTimelineLoading } =
    api.timeline.getById.useQuery(
      { id: timelineId },
      { enabled: !!timelineId },
    );

  const updateTimelineMutation = api.timeline.update.useMutation({
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

  const addCharacterMutation = api.character.create.useMutation();
  // const updateCharacterMutation = api.character.update.useMutation();
  const deleteCharacterMutation = api.character.delete.useMutation();

  const addEventMutation = api.event.create.useMutation();
  // const updateEventMutation = api.event.update.useMutation();
  const deleteEventMutation = api.event.delete.useMutation();

  useEffect(() => {
    if (fetchedTimelineData) {
      setLocalTimelineData({
        id: fetchedTimelineData.id,
        date: new Date(fetchedTimelineData.date),
        characters: fetchedTimelineData.characters.map((char) => ({
          ...char,
          id: char.id.toString(),
        })),
        events: fetchedTimelineData.events.map((event) => ({
          ...event,
          id: event.id.toString(),
          characterId: event.characterId.toString(),
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        })),
      });
    }
  }, [fetchedTimelineData]);

  const handleSaveTimeline = async () => {
    try {
      await updateTimelineMutation.mutateAsync({
        id: timelineId,
        date: localTimelineData.date,
      });
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast({
        title: "エラー",
        description: "タイムラインの保存中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleAddOrUpdateCharacter = async (
    character: Omit<Character, "id">,
  ) => {
    try {
      const result = await addCharacterMutation.mutateAsync({
        ...character,
        bookId: fetchedTimelineData?.timelineGroup.book.id ?? 0,
      });
      setLocalTimelineData((prev) => ({
        ...prev,
        characters: [
          ...prev.characters,
          { ...result, id: result.id.toString() },
        ],
      }));
    } catch (error) {
      console.error("Error adding/updating character:", error);
      toast({
        title: "エラー",
        description: "キャラクターの追加/更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    try {
      await deleteCharacterMutation.mutateAsync({ id: Number(id) });
      setLocalTimelineData((prev) => ({
        ...prev,
        characters: prev.characters.filter((char) => char.id !== id),
        events: prev.events.filter((event) => event.characterId !== id),
      }));
    } catch (error) {
      console.error("Error deleting character:", error);
      toast({
        title: "エラー",
        description: "キャラクターの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleAddOrUpdateEvent = async (event: Omit<Event, "id">) => {
    try {
      const result = await addEventMutation.mutateAsync({
        ...event,
        timelineId,
        characterId: Number(event.characterId),
      });
      setLocalTimelineData((prev) => ({
        ...prev,
        events: [
          ...prev.events,
          {
            ...result,
            id: result.id.toString(),
            characterId: result.characterId.toString(),
          },
        ],
      }));
    } catch (error) {
      console.error("Error adding/updating event:", error);
      toast({
        title: "エラー",
        description: "イベントの追加/更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync({ id: Number(id) });
      setLocalTimelineData((prev) => ({
        ...prev,
        events: prev.events.filter((event) => event.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "エラー",
        description: "イベントの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  return {
    timelineData: localTimelineData,
    isLoading: isTimelineLoading,
    handleSaveTimeline,
    handleAddOrUpdateCharacter,
    handleDeleteCharacter,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
  };
};
