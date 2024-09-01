// src/app/rooms/[id]/page.tsx
"use client";
import type React from "react";
import { useParams } from "next/navigation";
import { useRoomDetail } from "~/hooks/useRoomDetail";
import { RoomInfo } from "~/app/_components/rooms/detail/RoomInfo";
import { ChatArea } from "~/app/_components/rooms/detail/ChatArea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RoomDetailPage: React.FC = () => {
  const params = useParams();
  const roomId = Number(params.id);

  const {
    room,
    isLoading,
    error,
    isSharing,
    stream,
    newMessage,
    setNewMessage,
    videoRef,
    startScreenShare,
    handleSubmit,
  } = useRoomDetail(roomId);

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  if (!room) return <div>Room not found</div>;

  return (
    <div className="flex h-full bg-gray-700 relative rounded-lg">
      <RoomInfo
        room={room}
        onStartSharing={startScreenShare}
        isSharing={isSharing}
      />
      <ChatArea
        isSharing={isSharing}
        videoRef={videoRef}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RoomDetailPage;
