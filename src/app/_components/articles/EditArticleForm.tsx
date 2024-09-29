import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import ArticleEditor from "./ArticleEditor";

interface EditArticleFormProps {
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
  };
}

export default function EditArticleForm({ article }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [content, setContent] = useState(article.content);
  const router = useRouter();
  const { toast } = useToast();

  const updateArticleMutation = api.article.update.useMutation({
    onSuccess: () => {
      toast({ title: "記事が更新されました" });
      router.push(`/articles/${slug}`);
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
    updateArticleMutation.mutate({
      id: article.id,
      title,
      slug,
      excerpt,
      content,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button type="submit">更新</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
