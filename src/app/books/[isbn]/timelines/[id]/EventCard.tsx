import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "~/hooks/useTimelineData";

interface EventCardProps {
  event: Event;
  characterColor: string;
  onClick: () => void;
  top: string;
  height: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  characterColor,
  onClick,
  top,
  height,
}) => (
  <Card
    className={`absolute left-1 right-1 ${characterColor} text-white border-none cursor-pointer hover:brightness-110 transition-all`}
    style={{ top, height, minHeight: "20px" }}
    onClick={onClick}
  >
    <CardContent className="p-1 flex items-center justify-center h-full overflow-hidden">
      <div className="text-xs font-semibold truncate">{event.title}</div>
    </CardContent>
  </Card>
);
