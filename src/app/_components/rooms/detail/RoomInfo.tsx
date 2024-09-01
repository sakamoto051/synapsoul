// src/components/RoomInfo.tsx
import type React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Camera } from "lucide-react";
import type { Room } from "@prisma/client";

interface RoomInfoProps {
  room: Room;
  onStartSharing: () => void;
  isSharing: boolean;
}

export const RoomInfo: React.FC<RoomInfoProps> = ({
  room,
  onStartSharing,
  isSharing,
}) => (
  <Card className="bg-gray-800 text-white flex flex-col border-none">
    <CardHeader>
      <h2 className="text-xl font-bold">{room.title}</h2>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="flex items-center mb-4">
        <Users className="mr-2" />
        <span>3 participants</span>
      </div>
    </CardContent>
    <CardFooter>
      <Button
        variant="outline"
        onClick={onStartSharing}
        className="text-black"
        aria-label={isSharing ? "Stop sharing screen" : "Start sharing screen"}
      >
        <Camera className="mr-2" />
        {isSharing ? "Stop Sharing" : "Share Screen"}
      </Button>
    </CardFooter>
  </Card>
);
