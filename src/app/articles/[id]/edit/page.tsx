"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import EditArticleForm from "~/app/_components/articles/EditArticleForm";
import { Loader2 } from "lucide-react";
import type { Article } from "@prisma/client";
import { SessionProvider } from "next-auth/react";

export default function EditArticlePage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article>();

  const { data: fetchedArticle, isLoading: isFetching } =
    api.article.getById.useQuery(
      { id: Number(params.id) },
      { enabled: !!params.id },
    );

  useEffect(() => {
    if (fetchedArticle) {
      setArticle(fetchedArticle);
      setIsLoading(false);
    }
  }, [fetchedArticle]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!article) {
    return <div>記事が見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">記事を編集</h1>
      <SessionProvider>
        <EditArticleForm article={article} />
      </SessionProvider>
    </div>
  );
}
