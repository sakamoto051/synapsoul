"use client";
import type React from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { BookStatus } from "@prisma/client";
import { bookStatusConfig } from "~/config/bookStatus";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    <SessionProvider>
      <BookStatusDropdownInner
        currentStatus={currentStatus}
        onStatusChange={onStatusChange}
        isInMyBooks={isInMyBooks}
      />
    </SessionProvider>
  );
};

export const BookStatusDropdownInner: React.FC<BookStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  isInMyBooks,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    return (
      <Button
        className="w-full bg-gray-600 text-white"
        onClick={() => {
          router.push("/api/auth/signin");
        }}
      >
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${
            currentStatus && bookStatusConfig[currentStatus]
              ? bookStatusConfig[currentStatus].color
              : "bg-gray-600"
          } text-white flex items-center justify-between w-full text-xs p-2`}
        >
          <div className="flex items-center space-x-1 truncate">
            {currentStatus && bookStatusConfig[currentStatus] ? (
              <>
                <span>{bookStatusConfig[currentStatus].icon}</span>
                <span className="truncate">
                  {bookStatusConfig[currentStatus].label}
                </span>
              </>
            ) : (
              <>
                <HelpCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">ステータス未設定</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]">
        {(Object.keys(bookStatusConfig) as BookStatus[]).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status)}
            className={`${bookStatusConfig[status].color} text-white hover:${bookStatusConfig[status].color}/80 flex items-center`}
          >
            <span className="mr-2">{bookStatusConfig[status].icon}</span>
            <span>{bookStatusConfig[status].label}</span>
          </DropdownMenuItem>
        ))}
        {isInMyBooks && (
          <DropdownMenuItem
            onClick={() => onStatusChange(null)}
            className="bg-gray-600 text-white hover:bg-gray-700 flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            <span>ステータスを解除</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
