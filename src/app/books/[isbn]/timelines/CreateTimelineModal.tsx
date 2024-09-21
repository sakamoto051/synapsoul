// src/app/books/[isbn]/timelines/CreateTimelineModal.tsx
import type React from "react";
import { useState } from "react";
import { format } from "date-fns";
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

interface CreateTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  bookId: number;
  onTimelineCreated: () => void;
}

export const CreateTimelineModal: React.FC<CreateTimelineModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  bookId,
  onTimelineCreated,
}) => {
  const [title, setTitle] = useState("");

  const createTimelineMutation = api.timeline.create.useMutation({
    onSuccess: () => {
      onTimelineCreated();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTimelineMutation.mutate({
      title,
      date: selectedDate,
      bookId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいタイムラインを作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                タイトル
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                日付
              </label>
              <Input
                id="date"
                value={format(selectedDate, "yyyy年MM月dd日", { locale: ja })}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">作成</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
