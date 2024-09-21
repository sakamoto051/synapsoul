// src/app/books/[isbn]/timelines/page.tsx
"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { TimelineView } from "./TimelineView";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function TimelineListPage() {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: book, isLoading: isBookLoading } = api.book.getByIsbn.useQuery({
    isbn,
  });
  const {
    data: timelines,
    refetch: refetchTimelines,
    isLoading: isTimelinesLoading,
  } = api.timeline.getByBookId.useQuery(
    { bookId: book?.id ?? 0 },
    { enabled: !!book?.id },
  );

  const { toast } = useToast();

  const handleTimelineCreated = () => {
    refetchTimelines();
    toast({
      title: "タイムライン作成",
      description: "新しいタイムラインが作成されました。",
    });
  };

  if (isBookLoading || isTimelinesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-indigo-300 mb-4">
        タイムライン管理
      </h1>
      <div className="mb-4 flex justify-between items-center">
        <Link
          href={`/books/${isbn}`}
          className="text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          書籍詳細に戻る
        </Link>
      </div>

      <TimelineView
        timelines={timelines}
        bookId={book.id}
        onTimelineCreated={handleTimelineCreated}
      />
    </div>
  );
}
