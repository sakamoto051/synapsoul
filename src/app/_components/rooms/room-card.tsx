import React from "react";
import type { Room, Tag } from "@prisma/client";
import { formatDateInJST } from "~/utils/date";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

const RoomCard = ({ room, tags }: { room: Room; tags: Tag[] }) => {
  return (
    <Link href={`/rooms/${room.id}`}>
      <Card className="bg-gray-800 text-white border-none">
        <CardHeader>
          <CardTitle>{room.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{room.content}</p>
        </CardContent>
        <CardFooter>
          <div className="space-x-2">
            {tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </CardFooter>
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            {/* {[1, 2, 3].map((_, i) => (
              <Avatar
                key={i}
                className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
              >
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            ))} */}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDateInJST(room.createdAt)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RoomCard;
