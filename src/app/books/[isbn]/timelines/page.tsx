// src/app/books/[isbn]/timelines/page.tsx

"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FolderOpen, Calendar, ChevronRight } from "lucide-react";
import { TimelineGroupCreator } from "./TimelineGroupCreator";
import { TimelineCalendar } from "./TimelineCalendar";
import { CharacterManager } from "./[id]/CharacterManager";
import type { Character } from "~/types/timeline";

export default function TimelineListPage() {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: book } = api.book.getByIsbn.useQuery({ isbn });
  const { data: timelineGroups, refetch: refetchTimelineGroups } =
    api.timelineGroup.getByBookId.useQuery(
      { bookId: book?.id ?? 0 },
      { enabled: !!book?.id },
    );

  const createCharacterMutation = api.character.create.useMutation({
    onSuccess: () => {
      refetchTimelineGroups();
    },
  });

  const deleteCharacterMutation = api.character.delete.useMutation({
    onSuccess: () => {
      refetchTimelineGroups();
    },
  });

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const handleAddOrUpdateCharacter = async (
    character: Omit<Character, "id">,
  ) => {
    await createCharacterMutation.mutateAsync(character);
  };

  const handleDeleteCharacter = async (id: number) => {
    await deleteCharacterMutation.mutateAsync({ id });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-indigo-300 mb-4">
        タイムライン管理
      </h1>
      <div className="mb-4 flex justify-between items-center">
        <TimelineGroupCreator
          bookId={book.id}
          onCreated={refetchTimelineGroups}
        />
        <Link
          href={`/books/${isbn}`}
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          書籍詳細に戻る
        </Link>
      </div>

      <div className="space-y-4">
        {timelineGroups?.map((group) => (
          <Card
            key={group.id}
            className="bg-gray-800 border-none shadow-lg transition-all hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between bg-gray-750 rounded-t-lg p-4">
              <CardTitle className="text-xl text-indigo-300 flex items-center">
                <FolderOpen className="mr-2 h-5 w-5" />
                {group.title}
              </CardTitle>
              <CharacterManager
                timelineGroupId={group.id}
                characters={group.characters}
                onAddOrUpdateCharacter={handleAddOrUpdateCharacter}
                onDeleteCharacter={handleDeleteCharacter}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4">
                <TimelineCalendar
                  groupId={group.id}
                  bookId={book.id}
                  onCreated={refetchTimelineGroups}
                />
              </div>
              <div className="space-y-2">
                {group.timelines.map((timeline) => (
                  <Link
                    href={`/books/${isbn}/timelines/${timeline.id}`}
                    key={timeline.id}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                        <span className="text-gray-200">
                          {new Date(timeline.date).toLocaleDateString()}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {timelineGroups?.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400 mb-4">
            タイムライングループがありません。
          </p>
          <p className="text-indigo-400">
            新しくタイムライングループを作成してみましょう。
          </p>
        </div>
      )}
    </div>
  );
}
