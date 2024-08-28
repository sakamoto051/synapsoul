"use client";
import React, { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Camera, Users, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const RoomDetailPage = () => {
  const params = useParams();
  const roomId = params["id"] as string;
  const [newMessage, setNewMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const {
    data: room,
    isLoading,
    error,
  } = api.room.getById.useQuery({ id: roomId });

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } else {
      setIsSharing(false);
    }
  }, [stream]);

  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setStream(() => mediaStream);
      setIsSharing(true);

      const videoTrack = mediaStream.getVideoTracks();
      if (videoTrack && videoTrack[0]) {
        videoTrack[0].onended = () => {
          setStream(null);
        };
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="flex h-full bg-gray-700 relative rounded-lg">
      <Card className="bg-gray-800 text-white flex flex-col border-none">
        <CardHeader>
          <h2 className="text-xl font-bold">{room?.title}</h2>
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
            onClick={startScreenShare}
            className="text-black"
          >
            <Camera className="mr-2" />
            Share Screen
          </Button>
        </CardFooter>
      </Card>

      <div className="flex-1 flex flex-col rounded-lg">
        <ScrollArea className="flex-1 m-2 bg-opacity-20 bg-white relative rounded-lg">
          {isSharing && (
            <video
              ref={videoRef}
              autoPlay
              className="absolute inset-0 w-full object-cover"
            />
          )}
        </ScrollArea>

        <div className="m-4">
          <form>
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-black"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
