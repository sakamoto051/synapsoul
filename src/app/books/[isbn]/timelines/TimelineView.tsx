import type React from "react";
import { useState } from "react";
import { TimelineCalendarView } from "./TimelineCalendarView";
import { TimelineListView } from "./TimelineListView";
import { ViewToggle } from "./ViewToggle";

interface Timeline {
  id: number;
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineViewProps {
  timelines: Timeline[];
  bookId: number;
  timelineGroupId: number;
  onTimelineCreated: () => void;
}

type ViewMode = "calendar" | "list";
type CalendarMode = "year" | "month" | "day";

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelines,
  bookId,
  timelineGroupId,
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
          timelineGroupId={timelineGroupId}
          onTimelineCreated={onTimelineCreated}
        />
      ) : (
        <TimelineListView timelines={timelines} bookId={bookId} />
      )}
    </div>
  );
};
