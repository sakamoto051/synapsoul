// src/app/books/[isbn]/timelines/TimelineView.tsx
import type React from "react";
import { useState } from "react";
import { TimelineCalendarView } from "./TimelineCalendarView";
import { TimelineListView } from "./TimelineListView";
import { ViewToggle } from "./ViewToggle";
import { Loader2 } from "lucide-react";
import type { Timeline } from "@prisma/client";

// interface Timeline {
//   id: number;
//   title: string;
//   date: Date;
//   bookId: number;
// }

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
    </div>
  );
};
