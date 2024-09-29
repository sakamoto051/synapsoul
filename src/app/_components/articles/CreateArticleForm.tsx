import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ArticleEditor from "./ArticleEditor";

export default function CreateArticleForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const createArticleMutation = api.article.create.useMutation({
    onSuccess: () => {
      toast({ title: "記事が作成されました" });
      router.push("/articles");
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createArticleMutation.mutate({ title, slug, excerpt, content });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>新しい記事を作成</CardTitle>
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
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              スラッグ
            </label>
            <Input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700"
            >
              抜粋
            </label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="mt-1"
              rows={3}
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              本文
            </label>
            <ArticleEditor content={content} setContent={setContent} />
          </div>
          <Button type="submit" className="w-full">
            記事を作成
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
