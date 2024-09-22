import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import type { Book, Timeline, Event, Character, Prisma } from "@prisma/client";
import type { TimelineData } from "~/types/timeline";

interface FetchedTimelineData extends Timeline {
  book: Book & {
    characters: Character[];
  };
  events: (Event & {
    character: Character;
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
    createdAt: new Date(),
    updatedAt: new Date(),
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

  const deleteTimelineMutation = api.timeline.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "タイムラインを削除しました",
        description: "タイムラインが正常に削除されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `タイムラインの削除中にエラーが発生しました: ${error.message}`,
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
          isVisible: true,
        })),
        events: fetchedTimelineData.events.map((event) => ({
          ...event,
          id: event.id,
          characterId: event.characterId,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        })),
        createdAt: new Date(fetchedTimelineData.createdAt),
        updatedAt: new Date(fetchedTimelineData.updatedAt),
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

  const handleDeleteTimeline = async () => {
    try {
      await deleteTimelineMutation.mutateAsync({ id: timelineId });
    } catch (error) {
      console.error("Error deleting timeline:", error);
      toast({
        title: "エラー",
        description: "タイムラインの削除中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  const handleAddOrUpdateCharacter = async (
    character:
      | Prisma.CharacterCreateInput
      | (Prisma.CharacterUpdateInput & { id: number }),
  ) => {
    try {
      if ("id" in character) {
        const result = await updateCharacterMutation.mutateAsync({
          id: Number(character.id),
          name: typeof character.name === "string" ? character.name : "",
          color: typeof character.color === "string" ? character.color : "",
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

  const handleAddOrUpdateEvent = async (
    event: Omit<Event, "id" | "timelineId" | "createdAt" | "updatedAt"> & {
      id?: number;
    },
  ) => {
    try {
      if (event.id) {
        const result = await updateEventMutation.mutateAsync({
          id: event.id,
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
                  id: result.id,
                  characterId: result.characterId,
                }
              : e,
          ),
        }));
      } else {
        const result = await addEventMutation.mutateAsync({
          ...event,
          timelineId,
          characterId: event.characterId,
        });
        setLocalTimelineData((prev) => ({
          ...prev,
          events: [
            ...prev.events,
            {
              ...result,
              id: result.id,
              characterId: result.characterId,
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
      await deleteEventMutation.mutateAsync({ id: id });
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

  const toggleCharacterVisibility = useCallback((characterId: number) => {
    setLocalTimelineData((prev) => ({
      ...prev,
      characters: prev.characters.map((char) =>
        char.id === characterId
          ? { ...char, isVisible: !char.isVisible }
          : char,
      ),
    }));
  }, []);

  const visibleCharacters = useMemo(() => {
    return localTimelineData.characters.filter((char) => char.isVisible);
  }, [localTimelineData.characters]);

  return {
    timelineData: localTimelineData,
    setTimelineData: setLocalTimelineData,
    visibleCharacters,
    isLoading: isTimelineLoading,
    handleSaveTimeline,
    handleDeleteTimeline,
    handleAddOrUpdateCharacter,
    handleDeleteCharacter,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
    toggleCharacterVisibility,
  };
};
