import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import type { Event } from "~/hooks/useTimelineData";

interface EventCardProps {
  event: Event;
  characterColor: string;
  onEdit: () => void;
  onDelete: () => void;
  top: string;
  height: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  characterColor,
  onEdit,
  onDelete,
  top,
  height,
}) => (
  <Card
    className={`absolute left-0 right-0 ${characterColor} text-white border-none`}
    style={{ top, height, minHeight: "20px" }}
  >
    <CardContent className="p-2 flex justify-between items-center h-full">
      <div className="overflow-hidden">
        <p className="text-xs text-white truncate">{event.action}</p>
        <p className="text-xs text-white/75">
          {event.startTime.toLocaleTimeString()} -{" "}
          {event.endTime.toLocaleTimeString()}
        </p>
      </div>
      <div className="space-x-1 flex-shrink-0">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);
