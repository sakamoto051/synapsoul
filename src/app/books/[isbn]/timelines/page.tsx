// src/app/books/[isbn]/timelines/page.tsx

"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { TimelineView } from "./TimelineView";
import { TimelineGroupCreator } from "./TimelineGroupCreator";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function TimelineListPage() {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: book } = api.book.getByIsbn.useQuery({ isbn });
  const { data: timelineGroups, refetch: refetchTimelineGroups } =
    api.timelineGroup.getByBookId.useQuery(
      { bookId: book?.id ?? 0 },
      { enabled: !!book?.id },
    );

  const { toast } = useToast();

  const allTimelines =
    timelineGroups?.flatMap((group) =>
      group.timelines.map((timeline) => ({
        id: timeline.id,
        date: new Date(timeline.date),
        title:
          (
            timeline as {
              id: number;
              date: Date;
              timelineGroupId: number;
              createdAt: Date;
              updatedAt: Date;
              title?: string;
            }
          ).title ?? `Timeline ${timeline.id}`,
        content: `Group: ${group.title}`,
        createdAt: new Date(timeline.createdAt),
        updatedAt: new Date(timeline.updatedAt),
      })),
    ) ?? [];

  const handleTimelineCreated = () => {
    refetchTimelineGroups();
    toast({
      title: "タイムライン作成",
      description: "新しいタイムラインが作成されました。",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-indigo-300 mb-4">
        タイムライン管理
      </h1>
      <div className="mb-4 flex justify-between items-center">
        <TimelineGroupCreator
          bookId={book?.id ?? 0}
          onCreated={refetchTimelineGroups}
        />
        <Link
          href={`/books/${isbn}`}
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          書籍詳細に戻る
        </Link>
      </div>

      {timelineGroups && timelineGroups.length > 0 ? (
        <TimelineView
          timelines={allTimelines}
          bookId={book?.id ?? 0}
          timelineGroupId={timelineGroups?.[0]?.id ?? 0}
          onTimelineCreated={handleTimelineCreated}
        />
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400 mb-4">タイムラインがありません。</p>
          <p className="text-indigo-400">
            新しくタイムラインを作成してみましょう。
          </p>
        </div>
      )}
    </div>
  );
}
