// src/app/books/[isbn]/timelines/page.tsx

"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { TimelineGroupCreator } from "./TimelineGroupCreator";
import { TimelineCalendar } from "./TimelineCalendar";

export default function TimelineListPage() {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: book } = api.book.getByIsbn.useQuery({ isbn });
  const { data: timelineGroups, refetch: refetchTimelineGroups } =
    api.timelineGroup.getByBookId.useQuery(
      { bookId: book?.id ?? 0 },
      { enabled: !!book?.id },
    );

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">タイムライングループ一覧</h1>
      <div className="mb-4">
        <TimelineGroupCreator
          bookId={book.id}
          onCreated={refetchTimelineGroups}
        />
      </div>
      {timelineGroups?.map((group) => (
        <Card
          key={group.id}
          className="mb-4 bg-gray-800 border-none transition-colors"
        >
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center">
              <FolderOpen className="mr-2 h-4 w-4" />
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <TimelineCalendar
                groupId={group.id}
                bookId={book.id}
                onCreated={refetchTimelineGroups}
              />
            </div>
            {group.timelines.map((timeline) => (
              <Link
                href={`/books/${isbn}/timelines/${timeline.id}`}
                key={timeline.id}
              >
                <div className="p-2 hover:bg-gray-600 rounded">
                  <p className="text-sm text-gray-400 mt-1">
                    日付: {new Date(timeline.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      ))}
      {timelineGroups?.length === 0 && (
        <p className="text-center text-gray-400">
          タイムライングループがありません。新しく作成してみましょう。
        </p>
      )}
    </div>
  );
}
