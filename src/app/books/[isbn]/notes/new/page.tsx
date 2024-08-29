"use client";
import type React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Save } from "lucide-react";

const NewBookNote = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const isbn = params.isbn as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const utils = api.useContext();
  const {
    data: book,
    isLoading,
    error,
  } = api.book.getByIsbn.useQuery({ isbn });
  const createNoteMutation = api.note.create.useMutation({
    onSuccess: () => {
      // 新しいノートが作成されたら、book.getByIsbn クエリを無効化
      utils.book.getByIsbn.invalidate({ isbn });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) {
      toast({
        title: "エラー",
        description: "書籍情報が見つかりません。",
        variant: "destructive",
      });
      return;
    }
    try {
      await createNoteMutation.mutateAsync({
        bookId: book.id,
        title,
        content,
      });
      toast({
        title: "読書メモを作成しました",
        description: "新しい読書メモが正常に作成されました。",
      });
      router.push(`/books/${isbn}/notes`);
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "エラー",
        description: "読書メモの作成中にエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (!book) {
    return <div>書籍が見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            新しい読書メモ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300"
              >
                タイトル
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 bg-gray-700 text-white border-gray-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                内容
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 bg-gray-700 text-white border-gray-600"
                rows={10}
                required
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => router.push(`/books/${isbn}/notes`)}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewBookNote;
