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
import { Calendar } from "@/components/ui/calendar";

interface DateSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  currentDate: Date;
}

export const DateSelectModal: React.FC<DateSelectModalProps> = ({
  isOpen,
  onClose,
  onDateSelect,
  currentDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentDate,
  );

  const handleDateSelect = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タイムラインの日付を選択</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ja}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleDateSelect} disabled={!selectedDate}>
            選択
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
