// src/components/CommentForm.tsx
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  value,
  onChange,
  onSubmit,
}) => (
  <div className="mt-4 flex space-x-2">
    <Input
      placeholder="新しいコメントを追加"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-grow bg-gray-700/50 text-gray-200 border-gray-600/50 text-sm"
    />
    <Button
      onClick={onSubmit}
      className="bg-indigo-600/70 hover:bg-indigo-700/70 text-gray-200 px-3 py-2"
    >
      <Send className="h-4 w-4" />
    </Button>
  </div>
);
