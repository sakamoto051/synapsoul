import type React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface Timeline {
  id: number;
  date: Date;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineListViewProps {
  timelines: Timeline[];
}

export const TimelineListView: React.FC<TimelineListViewProps> = ({
  timelines,
}) => {
  const params = useParams();
  const isbn = params.isbn as string;
  const sortedTimelines = [...timelines].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedTimelines.map((timeline) => (
        <Link
          href={`/books/${isbn}/timelines/${timeline.id}`}
          key={timeline.id}
          className="block"
        >
          <Card className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                {timeline.title}
              </h3>
              <p className="text-sm text-gray-400">
                日付:{" "}
                {format(timeline.date, "yyyy年 MM月 dd日", { locale: ja })}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
      {timelines.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          タイムラインがありません。新しいタイムラインを作成してください。
        </div>
      )}
    </div>
  );
};
