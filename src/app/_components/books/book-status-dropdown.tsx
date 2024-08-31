import type React from "react";
import { ChevronDown } from "lucide-react";
import { BookStatus } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BookStatusDropdownProps {
  currentStatus: BookStatus;
  onStatusChange: (status: BookStatus) => void;
}

const statusConfig = {
  [BookStatus.READING]: { label: "読んでいる本", color: "bg-blue-600" },
  [BookStatus.TO_READ]: { label: "積んでいる本", color: "bg-green-600" },
  [BookStatus.INTERESTED]: { label: "気になる本", color: "bg-yellow-600" },
  [BookStatus.FINISHED]: { label: "読み終わった本", color: "bg-purple-600" },
  [BookStatus.DNF]: { label: "途中で読むのをやめた本", color: "bg-red-600" },
  [BookStatus.REFERENCE]: { label: "参考書", color: "bg-indigo-600" },
  [BookStatus.FAVORITE]: { label: "お気に入り", color: "bg-pink-600" },
  [BookStatus.REREADING]: { label: "再読中", color: "bg-teal-600" },
};

export const BookStatusDropdown: React.FC<BookStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={`${statusConfig[currentStatus].color} text-white`}>
          {statusConfig[currentStatus].label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {Object.entries(statusConfig).map(([status, config]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status as BookStatus)}
            className={`${config.color} text-white hover:${config.color}/80`}
          >
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
