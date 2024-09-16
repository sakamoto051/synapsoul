"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function CreateTimelinePage() {
  const [title, setTitle] = useState("");
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const isbn = params.isbn as string;

  const { data: book } = api.book.getByIsbn.useQuery({ isbn });
  const createTimelineMutation = api.timeline.create.useMutation({
    onSuccess: () => {
      toast({
        title: "タイムラインを作成しました",
        description: "新しいタイムラインが正常に作成されました。",
      });
      router.push(`/books/${isbn}/timelines`);
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `タイムラインの作成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book?.id) {
      toast({
        title: "エラー",
        description: "書籍情報が見つかりません。",
        variant: "destructive",
      });
      return;
    }
    createTimelineMutation.mutate({ title, bookId: book.id });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>新規タイムライン作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                タイトル
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createTimelineMutation.isPending}
            >
              {createTimelineMutation.isPending
                ? "作成中..."
                : "タイムラインを作成"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
