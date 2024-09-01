// src/hooks/useRoomDetail.ts
import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";

export const useRoomDetail = (roomId: number) => {
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const {
    data: room,
    isLoading,
    error,
  } = api.room.getById.useQuery({ id: roomId });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
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

      setStream(mediaStream);
      setIsSharing(true);

      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          setStream(null);
          setIsSharing(false);
        };
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
      toast({
        title: "Error",
        description: "Failed to start screen sharing",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement message sending logic
    setNewMessage("");
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  return {
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
  };
};
