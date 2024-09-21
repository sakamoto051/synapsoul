// src/hooks/useTimelineData.ts
import { useState, useEffect, useMemo } from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import type {
  Book,
  Timeline,
  Event,
  Character as CharacterPrisma,
} from "@prisma/client";
import type { Character } from "~/types/timeline";

export interface TimelineData {
  id: number;
  title: string;
  date: Date;
  bookId: number;
  characters: (Character & { isVisible: boolean })[];
  events: Event[];
}

interface FetchedTimelineData extends Timeline {
  book: Book & {
    characters: CharacterPrisma[];
  };
  events: (Event & {
    character: CharacterPrisma;
  })[];
}

export const useTimelineData = (timelineId: number) => {
  const [localTimelineData, setLocalTimelineData] = useState<TimelineData>({
    id: timelineId,
    title: "",
    date: new Date(),
    bookId: 0,
    characters: [],
    events: [],
  });

  const { toast } = useToast();

  const { data: fetchedTimelineData, isLoading: isTimelineLoading } =
    api.timeline.getById.useQuery<FetchedTimelineData>(
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
  const updateCharacterMutation = api.character.update.useMutation();
  const deleteCharacterMutation = api.character.delete.useMutation();

  const addEventMutation = api.event.create.useMutation();
  const updateEventMutation = api.event.update.useMutation();
  const deleteEventMutation = api.event.delete.useMutation();

  useEffect(() => {
    if (fetchedTimelineData) {
      setLocalTimelineData({
        id: fetchedTimelineData.id,
        title: fetchedTimelineData.title,
        date: new Date(fetchedTimelineData.date),
        bookId: fetchedTimelineData.bookId,
        characters: fetchedTimelineData.book.characters.map((char) => ({
          ...char,
          id: char.id,
          isVisible: true, // デフォルトで全キャラクターを表示
        })),
        events: fetchedTimelineData.events.map((event) => ({
          ...event,
          id: event.id,
          characterId: event.characterId,
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
        title: localTimelineData.title,
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
    character: Omit<Character, "id" | "isVisible" | "bookId">,
  ) => {
    try {
      if ("id" in character) {
        const result = await updateCharacterMutation.mutateAsync({
          id: Number(character.id),
          name: character.name,
          color: character.color,
        });
        setLocalTimelineData((prev) => ({
          ...prev,
          characters: prev.characters.map((c) =>
            c.id === character.id
              ? { ...result, id: result.id, isVisible: c.isVisible }
              : c,
          ),
        }));
      } else {
        const result = await addCharacterMutation.mutateAsync({
          ...character,
          bookId: localTimelineData.bookId,
        });
        setLocalTimelineData((prev) => ({
          ...prev,
          characters: [
            ...prev.characters,
            { ...result, id: result.id, isVisible: true },
          ],
        }));
      }
    } catch (error) {
      console.error("Error adding/updating character:", error);
      toast({
        title: "エラー",
        description: "キャラクターの追加/更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCharacter = async (id: number) => {
    try {
      await deleteCharacterMutation.mutateAsync({ id: id });
      setLocalTimelineData((prev) => ({
        ...prev,
        characters: prev.characters.filter((char) => char.id !== id),
        events: prev.events.filter((event) => Number(event.characterId) !== id),
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
      if ("id" in event) {
        const result = await updateEventMutation.mutateAsync({
          id: Number(event.id),
          title: event.title,
          content: event.content,
          startTime: event.startTime,
          endTime: event.endTime,
        });
        setLocalTimelineData((prev) => ({
          ...prev,
          events: prev.events.map((e) =>
            e.id === event.id
              ? {
                  ...result,
                  id: Number(result.id),
                  characterId: Number(result.characterId),
                }
              : e,
          ),
        }));
      } else {
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
              id: Number(result.id),
              characterId: Number(result.characterId),
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error adding/updating event:", error);
      toast({
        title: "エラー",
        description: "イベントの追加/更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
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

  const toggleCharacterVisibility = (characterId: number) => {
    setLocalTimelineData((prev) => ({
      ...prev,
      characters: prev.characters.map((char) =>
        char.id === characterId
          ? { ...char, isVisible: !char.isVisible }
          : char,
      ),
    }));
  };

  const visibleCharacters = useMemo(() => {
    return localTimelineData.characters.filter((char) => char.isVisible);
  }, [localTimelineData.characters]);

  return {
    timelineData: localTimelineData,
    visibleCharacters,
    isLoading: isTimelineLoading,
    handleSaveTimeline,
    handleAddOrUpdateCharacter,
    handleDeleteCharacter,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
    toggleCharacterVisibility,
  };
};
