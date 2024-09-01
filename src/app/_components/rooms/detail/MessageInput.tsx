// src/app/_components/rooms/detail/MessageInput.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  onNewMessageChange,
  onSubmit,
}) => (
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
);
