// src/components/ChatArea.tsx
import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatAreaProps {
  isSharing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  isSharing,
  videoRef,
  newMessage,
  onNewMessageChange,
  onSubmit,
}) => (
  <div className="flex-1 flex flex-col rounded-lg">
    <ScrollArea className="flex-1 m-2 bg-opacity-20 bg-white relative rounded-lg">
      {isSharing && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            className="absolute inset-0 w-full h-full object-contain"
          >
            <track
              kind="captions"
              src="data:text/vtt,WEBVTT%0A%0A00:00:00.000 --> 00:00:30.000%0AScreen sharing is active"
              srcLang="en"
              label="English"
              default
            />
          </video>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
            Screen sharing is active
          </div>
        </div>
      )}
    </ScrollArea>

    <div className="m-4">
      <form onSubmit={onSubmit}>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-black"
          />
          <Button type="submit" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  </div>
);
