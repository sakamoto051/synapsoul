import type React from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import { BookStatus } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BookStatusDropdownProps {
  currentStatus: BookStatus | null;
  onStatusChange: (status: BookStatus | null) => void;
  isInMyBooks: boolean;
}

const statusConfig = {
  [BookStatus.READING]: {
    label: "読んでいる本",
    color: "bg-blue-600",
    icon: "📖",
  },
  [BookStatus.TO_READ]: {
    label: "積んでいる本",
    color: "bg-green-600",
    icon: "📚",
  },
  [BookStatus.INTERESTED]: {
    label: "気になる本",
    color: "bg-yellow-600",
    icon: "🤔",
  },
  [BookStatus.FINISHED]: {
    label: "読み終わった本",
    color: "bg-purple-600",
    icon: "✅",
  },
  [BookStatus.DNF]: {
    label: "途中で読むのをやめた本",
    color: "bg-red-600",
    icon: "🛑",
  },
  [BookStatus.REFERENCE]: {
    label: "参考書",
    color: "bg-indigo-600",
    icon: "📘",
  },
  [BookStatus.FAVORITE]: {
    label: "お気に入り",
    color: "bg-pink-600",
    icon: "⭐",
  },
  [BookStatus.REREADING]: { label: "再読中", color: "bg-teal-600", icon: "🔄" },
};

export const BookStatusDropdown: React.FC<BookStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  isInMyBooks,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${
            currentStatus ? statusConfig[currentStatus].color : "bg-gray-600"
          } text-white flex items-center justify-between min-w-[200px]`}
        >
          {currentStatus ? (
            <>
              <span>{statusConfig[currentStatus].icon}</span>
              <span>{statusConfig[currentStatus].label}</span>
            </>
          ) : isInMyBooks ? (
            <>
              <X className="h-4 w-4 mr-2" />
              <span>ステータス未設定 (マイブックに追加済み)</span>
            </>
          ) : (
            <>
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>ステータス未設定</span>
            </>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {Object.entries(statusConfig).map(([status, config]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status as BookStatus)}
            className={`${config.color} text-white hover:${config.color}/80 flex items-center`}
          >
            <span className="mr-2">{config.icon}</span>
            <span>{config.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onStatusChange(null)}
          className="bg-gray-600 text-white hover:bg-gray-700 flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          <span>
            {isInMyBooks
              ? "ステータスを解除 (マイブックから削除)"
              : "ステータスを未設定に"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
