// src/app/books/[isbn]/timelines/TimelineCalendar.tsx

import type React from "react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";

interface TimelineCalendarProps {
  groupId: number;
  bookId: number;
  onCreated: () => void;
}

export const TimelineCalendar: React.FC<TimelineCalendarProps> = ({
  groupId,
  bookId,
  onCreated,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const createTimelineMutation = api.timeline.create.useMutation({
    onSuccess: (newTimeline) => {
      setIsDialogOpen(false);
      onCreated();
      toast({
        title: "タイムライン作成",
        description: "新しいタイムラインが作成されました。",
      });
      router.push(`/books/${bookId}/timelines/${newTimeline.id}`);
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `タイムラインの作成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateTimeline = () => {
    if (date) {
      createTimelineMutation.mutate({
        timelineGroupId: groupId,
        date: date,
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-700 hover:text-white border-none"
        >
          新しいタイムラインを作成
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいタイムラインを作成</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <Button onClick={handleCreateTimeline}>作成</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
