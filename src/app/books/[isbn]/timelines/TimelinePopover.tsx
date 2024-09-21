import type React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface Timeline {
  id: number;
  date: Date;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelinePopoverProps {
  timeline: Timeline;
  children: React.ReactNode;
}

export const TimelinePopover: React.FC<TimelinePopoverProps> = ({
  timeline,
  children,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h3 className="font-semibold">{timeline.title}</h3>
          <p className="text-sm text-gray-500">
            タイムライン日付: {format(timeline.date, "PPP")}
          </p>
          <p className="text-xs text-gray-400">
            作成日: {format(timeline.createdAt, "PPP")}
          </p>
          <p className="text-xs text-gray-400">
            最終更新日: {format(timeline.updatedAt, "PPP")}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
