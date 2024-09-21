import type React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

interface Timeline {
  id: number;
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineListViewProps {
  timelines: Timeline[];
  bookId: number;
}

export const TimelineListView: React.FC<TimelineListViewProps> = ({
  timelines,
  bookId,
}) => {
  const sortedTimelines = [...timelines].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedTimelines.map((timeline) => (
        <Link
          href={`/books/${bookId}/timelines/${timeline.id}`}
          key={timeline.id}
          className="block"
        >
          <div className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-blue-300">
              {timeline.title}
            </h3>
            <p className="text-sm text-gray-400">
              日付: {format(timeline.date, "yyyy年 MM月 dd日", { locale: ja })}
            </p>
            <p className="mt-2 text-gray-300">{timeline.content}</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>
                作成日:{" "}
                {format(timeline.createdAt, "yyyy年 MM月 dd日", { locale: ja })}
              </p>
              <p>
                更新日:{" "}
                {format(timeline.updatedAt, "yyyy年 MM月 dd日", { locale: ja })}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
