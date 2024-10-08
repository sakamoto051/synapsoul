import type React from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Trash2, Users } from "lucide-react";
import { EventManager } from "./EventManager";
import { TimelineGrid } from "./TimelineGrid";
import { CharacterVisibilityToggle } from "./CharacterVisibilityToggle";
import type { Character, TimelineData } from "~/types/timeline";
import type { Event } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TimelinePageProps {
  timelineData: TimelineData;
  setTimelineData: React.Dispatch<React.SetStateAction<TimelineData>>;
  visibleCharacters: Character[];
  onSave: () => Promise<void>;
  onAddOrUpdateEvent: (event: Omit<Event, "id">) => Promise<void>;
  onDeleteEvent: (id: number) => Promise<void>;
  toggleCharacterVisibility: (characterId: number) => void;
  onDeleteTimeline: () => Promise<void>;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  timelineData,
  setTimelineData,
  visibleCharacters,
  onSave,
  onAddOrUpdateEvent,
  onDeleteEvent,
  toggleCharacterVisibility,
  onDeleteTimeline,
}) => {
  const params = useParams();
  const router = useRouter();
  const isbn = params.isbn as string;

  const handleEditEvent = (updatedEvent: Event) => {
    setTimelineData((prevData) => ({
      ...prevData,
      events: prevData.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    }));
    onAddOrUpdateEvent(updatedEvent);
  };

  const handleDeleteTimeline = async () => {
    await onDeleteTimeline();
    router.push(`/books/${isbn}/timelines`);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col mb-6 space-y-4">
        <div className="inline">
          <Link href={`/books/${isbn}/timelines`} passHref className="inline">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              タイムライン一覧に戻る
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/books/${isbn}/characters`}
            passHref
            className="flex-grow sm:flex-grow-0"
          >
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
              <Users className="mr-2 h-4 w-4" />
              キャラクター管理
            </Button>
          </Link>
          <EventManager
            characters={visibleCharacters}
            onAddOrUpdateEvent={onAddOrUpdateEvent}
          />
          <Button
            onClick={onSave}
            className="flex-grow sm:flex-grow-0 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex-grow sm:flex-grow-0 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  タイムラインを削除しますか？
                </AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。タイムラインとそれに関連するすべてのイベントが削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTimeline}>
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border mb-4">
        <div className="flex w-max space-x-2 p-2">
          <CharacterVisibilityToggle
            characters={timelineData.characters}
            toggleVisibility={toggleCharacterVisibility}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TimelineGrid
        characters={visibleCharacters}
        events={timelineData.events}
        onEditEvent={handleEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </div>
  );
};
