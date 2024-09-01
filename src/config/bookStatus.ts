// src/config/bookStatus.ts
import { BookStatus } from "@prisma/client";
import type { StatusConfig } from "~/app/_components/books/StatusDropdown";

export const bookStatusConfig: StatusConfig<BookStatus> = {
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
    label: "読むのをやめた本",
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
  [BookStatus.REREADING]: {
    label: "再読中",
    color: "bg-teal-600",
    icon: "🔄",
  },
};

export const getStatusLabel = (status: BookStatus): string => {
  return bookStatusConfig[status]?.label || "不明なステータス";
};

export const getStatusColor = (status: BookStatus): string => {
  return bookStatusConfig[status]?.color || "bg-gray-600";
};

export const getStatusIcon = (status: BookStatus): React.ReactNode => {
  return bookStatusConfig[status]?.icon || "❓";
};
