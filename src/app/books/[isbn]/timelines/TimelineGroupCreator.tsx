// src/app/books/[isbn]/timelines/TimelineGroupCreator.tsx

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

interface TimelineGroupCreatorProps {
  bookId: number;
  onCreated: () => void;
}

export const TimelineGroupCreator: React.FC<TimelineGroupCreatorProps> = ({
  bookId,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const createGroupMutation = api.timelineGroup.create.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false);
      setTitle("");
      onCreated();
      toast({
        title: "グループ作成",
        description: "新しいタイムライングループが作成されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `グループの作成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateGroup = () => {
    if (title) {
      createGroupMutation.mutate({
        title: title,
        bookId: bookId,
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-700 hover:bg-white border-none"
        >
          新しいタイムライングループを作成
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいタイムライングループを作成</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="グループのタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={handleCreateGroup}>作成</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
