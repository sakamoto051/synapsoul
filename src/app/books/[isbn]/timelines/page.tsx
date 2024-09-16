"use client";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";

export default function TimelineListPage() {
  const params = useParams();
  const isbn = params.isbn as string;
  const { data: book } = api.book.getByIsbn.useQuery({ isbn });
  const { data: timelines } = api.timeline.getByBookId.useQuery(
    { bookId: book?.id ?? 0 },
    { enabled: !!book?.id },
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">タイムライン一覧</h1>
      <div className="mb-4">
        <Link href={`/books/${isbn}/timelines/create`} passHref>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            新しいタイムラインを作成
          </Button>
        </Link>
      </div>
      {timelines?.map((timeline) => (
        <Link
          href={`/books/${isbn}/timelines/${timeline.id}`}
          key={timeline.id}
        >
          <Card className="mb-4 bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-blue-300 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {timeline.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mt-2">
                作成日: {new Date(timeline.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
      {timelines?.length === 0 && (
        <p className="text-center text-gray-400">
          タイムラインがありません。新しく作成してみましょう。
        </p>
      )}
    </div>
  );
}
