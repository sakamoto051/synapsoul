import type React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ViewToggleProps {
  viewMode: "calendar" | "list";
  calendarMode: "year" | "month" | "day";
  onViewModeChange: (mode: "calendar" | "list") => void;
  onCalendarModeChange: (mode: "year" | "month" | "day") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  calendarMode,
  onViewModeChange,
  onCalendarModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="flex space-x-2 w-full sm:w-auto">
        <Button
          variant={viewMode === "calendar" ? "default" : "secondary"}
          onClick={() => onViewModeChange("calendar")}
          className={`${
            viewMode === "calendar"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } transition-colors duration-200 flex-grow sm:flex-grow-0`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          カレンダー
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "secondary"}
          onClick={() => onViewModeChange("list")}
          className={`${
            viewMode === "list"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } transition-colors duration-200 flex-grow sm:flex-grow-0`}
        >
          <List className="mr-2 h-4 w-4" />
          リスト
        </Button>
      </div>
      {viewMode === "calendar" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 w-full sm:w-auto"
            >
              {calendarMode === "year" && "年"}
              {calendarMode === "month" && "月"}
              {calendarMode === "day" && "日"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onCalendarModeChange("year")}
              className={calendarMode === "year" ? "bg-blue-100" : ""}
            >
              年表示
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCalendarModeChange("month")}
              className={calendarMode === "month" ? "bg-blue-100" : ""}
            >
              月表示
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCalendarModeChange("day")}
              className={calendarMode === "day" ? "bg-blue-100" : ""}
            >
              日表示
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
