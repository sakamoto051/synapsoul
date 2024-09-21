// src/app/books/[isbn]/timelines/TimelineView.tsx
import type React from "react";
import { useState } from "react";
import { TimelineCalendarView } from "./TimelineCalendarView";
import { TimelineListView } from "./TimelineListView";
import { ViewToggle } from "./ViewToggle";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Timeline } from "@prisma/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";

interface TimelineViewProps {
  timelines: Timeline[] | undefined;
  bookId: number;
  onTimelineCreated: () => void;
}

type ViewMode = "calendar" | "list";
type CalendarMode = "year" | "month" | "day";

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelines,
  bookId,
  onTimelineCreated,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const params = useParams();
  const isbn = params.isbn as string;

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleCalendarModeChange = (mode: CalendarMode) => {
    setCalendarMode(mode);
  };

  if (timelines === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex justify-between">
        <Link href={`/books/${isbn}`} passHref>
          <Button
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            書籍詳細に戻る
          </Button>
        </Link>
        <ViewToggle
          viewMode={viewMode}
          calendarMode={calendarMode}
          onViewModeChange={handleViewModeChange}
          onCalendarModeChange={handleCalendarModeChange}
        />
      </div>
      {viewMode === "calendar" ? (
        <TimelineCalendarView
          timelines={timelines}
          mode={calendarMode}
          bookId={bookId}
          onTimelineCreated={onTimelineCreated}
        />
      ) : (
        <TimelineListView timelines={timelines} bookId={bookId} />
      )}
    </>
  );
};
