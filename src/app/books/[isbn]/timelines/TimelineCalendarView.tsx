import type React from "react";
import { useState, useMemo } from "react";
import {
  format,
  addYears,
  subYears,
  isSameYear,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelinePopover } from "./TimelinePopover";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Timeline {
  id: number;
  title: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineCalendarViewProps {
  timelines: Timeline[];
  mode: "year" | "month" | "day";
  onTimelineCreated: () => void;
}

export const TimelineCalendarView: React.FC<TimelineCalendarViewProps> = ({
  timelines,
  mode,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const params = useParams();
  const isbn = params.isbn as string;

  const timelinesInView = useMemo(() => {
    switch (mode) {
      case "year":
        return timelines.filter((t) => isSameYear(t.date, currentDate));
      case "month":
        return timelines.filter((t) => isSameMonth(t.date, currentDate));
      case "day":
        return timelines.filter((t) => isSameDay(t.date, currentDate));
    }
  }, [timelines, currentDate, mode]);

  const navigatePrev = () => {
    switch (mode) {
      case "year":
        setCurrentDate((d) => subYears(d, 1));
        break;
      case "month":
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
        break;
      case "day":
        setCurrentDate(
          (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1),
        );
        break;
    }
  };

  const navigateNext = () => {
    switch (mode) {
      case "year":
        setCurrentDate((d) => addYears(d, 1));
        break;
      case "month":
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
        break;
      case "day":
        setCurrentDate(
          (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1),
        );
        break;
    }
  };

  const renderHeader = () => {
    let dateFormat: string;
    switch (mode) {
      case "year":
        dateFormat = "yyyy";
        break;
      case "month":
        dateFormat = "yyyy/MM";
        break;
      case "day":
        dateFormat = "yyyy/MM/dd";
        break;
    }

    return (
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={navigatePrev}
          variant="outline"
          className="text-gray-700 bg-white hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-bold">
          {format(currentDate, dateFormat, { locale: ja })}
        </span>
        <Button
          onClick={navigateNext}
          variant="outline"
          className="text-gray-700 bg-white hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderYearView = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentDate.getFullYear(), month, 1);
      const monthTimelines = timelinesInView.filter(
        (t) => t.date.getMonth() === month,
      );
      months.push(
        <div key={month} className="border p-2 h-48 overflow-y-auto">
          <h3 className="font-bold mb-2">
            {format(date, "M月", { locale: ja })}
          </h3>
          {monthTimelines.map((timeline) => (
            <TimelinePopover key={timeline.id} timeline={timeline}>
              <Link
                href={`/books/${isbn}/timelines/${timeline.id}`}
                className="block"
              >
                <div className="bg-indigo-600 text-white p-1 mb-1 text-xs rounded cursor-pointer hover:bg-indigo-700 transition-colors">
                  {format(timeline.date, "d日", { locale: ja })} -{" "}
                  {timeline.title}
                </div>
              </Link>
            </TimelinePopover>
          ))}
        </div>,
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {months}
      </div>
    );
  };

  const renderMonthView = () => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {days.map((day) => {
          const dayTimelines = timelinesInView.filter((t) =>
            isSameDay(t.date, day),
          );
          return (
            <div
              key={day.toString()}
              className="border p-2 h-32 overflow-y-auto"
            >
              <div className="font-bold mb-1">
                {format(day, "d日", { locale: ja })}
              </div>
              {dayTimelines.map((timeline) => (
                <TimelinePopover key={timeline.id} timeline={timeline}>
                  <Link
                    href={`/books/${isbn}/timelines/${timeline.id}`}
                    className="block"
                  >
                    <div className="bg-indigo-600 text-white p-1 mb-1 text-xs rounded cursor-pointer hover:bg-indigo-700 transition-colors">
                      {timeline.title}
                    </div>
                  </Link>
                </TimelinePopover>
              ))}
            </div>
          );
        })}
      </div>
    );
  };
  const renderDayView = () => {
    return (
      <div className="space-y-2">
        {timelinesInView.map((timeline) => (
          <TimelinePopover key={timeline.id} timeline={timeline}>
            <Link
              href={`/books/${isbn}/timelines/${timeline.id}`}
              className="block"
            >
              <div className="bg-indigo-600 text-white p-2 rounded cursor-pointer hover:bg-indigo-700 transition-colors">
                <div className="font-bold">{timeline.title}</div>
              </div>
            </Link>
          </TimelinePopover>
        ))}
        {timelinesInView.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            この日のタイムラインはありません。
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-4">
      {renderHeader()}
      {mode === "year" && renderYearView()}
      {mode === "month" && renderMonthView()}
      {mode === "day" && renderDayView()}
    </div>
  );
};
