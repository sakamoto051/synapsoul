import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@prisma/client";

interface EventCardProps {
  event: Event;
  characterColor: string;
  onClick: () => void;
  top: string;
  height: string;
  left: string;
  width: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  characterColor,
  onClick,
  top,
  height,
  left,
  width,
}) => (
  <Card
    className={`absolute ${characterColor} text-white border-2 border-gray-500 cursor-pointer hover:brightness-110 transition-all shadow-md`}
    style={{
      top,
      height,
      left: `calc(${left} + 1px)`,
      width: `calc(${width} - 2px)`,
      minHeight: "15px",
    }}
    onClick={onClick}
  >
    <CardContent className="p-1 flex flex-col items-start justify-center h-full overflow-hidden">
      <div className="text-xs font-semibold truncate w-full">{event.title}</div>
      <div className="text-xs opacity-75 pl-2">{event.title}</div>
    </CardContent>
  </Card>
);
