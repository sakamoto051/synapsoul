// src/app/_components/books/book-status-dropdown.tsx
import type React from "react";
import type { BookStatus } from "@prisma/client";
import { StatusDropdown } from "~/app/_components/books/StatusDropdown";
import { bookStatusConfig } from "~/config/bookStatus";

interface BookStatusDropdownProps {
  currentStatus: BookStatus | null;
  onStatusChange: (status: BookStatus | null) => void;
  isInMyBooks: boolean;
}

export const BookStatusDropdown: React.FC<BookStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  isInMyBooks,
}) => {
  return (
    <StatusDropdown
      currentStatus={currentStatus}
      onStatusChange={onStatusChange}
      statusConfig={bookStatusConfig}
      allowNull={true}
      nullLabel={
        isInMyBooks
          ? "ステータスを解除 (マイブックから削除)"
          : "ステータスを未設定に"
      }
    />
  );
};
