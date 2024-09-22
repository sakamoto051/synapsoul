import type React from "react";
import { useState } from "react";
import { ja } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "~/trpc/react";
import { Calendar } from "@/components/ui/calendar";

interface CreateTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: number;
  onTimelineCreated: () => void;
}

export const CreateTimelineModal: React.FC<CreateTimelineModalProps> = ({
  isOpen,
  onClose,
  bookId,
  onTimelineCreated,
}) => {
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const createTimelineMutation = api.timeline.create.useMutation({
    onSuccess: () => {
      onTimelineCreated();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && selectedDate) {
      createTimelineMutation.mutate({
        title,
        date: selectedDate,
        bookId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新しいタイムラインを作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            required
            placeholder="タイトル"
          />
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            locale={ja}
          />
          <DialogFooter>
            <Button type="submit">作成</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
