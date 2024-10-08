import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookText, Users, ShoppingCart } from "lucide-react";
import type { BookItem } from "~/types/book";
import { BookStatusDropdown } from "~/app/_components/books/BookStatusDropDown";
import type { BookStatus } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import useAuthStore from "~/store/useAuthStore";

interface BookActionsProps {
  book: BookItem;
  currentStatus: BookStatus | null;
  isInMyBooks: boolean;
  onStatusChange: (status: BookStatus | null) => void;
}

export const BookActions: React.FC<BookActionsProps> = ({
  book,
  currentStatus,
  isInMyBooks,
  onStatusChange,
}) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col gap-4">
      <BookStatusDropdown
        currentStatus={currentStatus}
        onStatusChange={onStatusChange}
        isInMyBooks={isInMyBooks}
      />
      {isAuthenticated && currentStatus === null && (
        <Alert
          variant="default"
          className="bg-blue-900 border-blue-700 text-white"
        >
          <Info className="h-4 w-4" />
          <AlertDescription>
            この本にはまだステータスが設定されていません。ステータスを設定すると、マイブックに追加されます。
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/books/${book.isbn}/notes`}
          passHref
          className="flex-1 min-w-[120px]"
        >
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            <BookText className="mr-2 h-4 w-4" />
            読書メモ
          </Button>
        </Link>
        <Link
          href={`/books/${book.isbn}/public-notes`}
          passHref
          className="flex-1 min-w-[120px]"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Users className="mr-2 h-4 w-4" />
            公開メモを見る
          </Button>
        </Link>
        <Link
          href={book.affiliateUrl}
          passHref
          className="flex-1 min-w-[120px]"
        >
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            <ShoppingCart className="mr-2 h-4 w-4" />
            楽天で購入
          </Button>
        </Link>
      </div>
    </div>
  );
};
