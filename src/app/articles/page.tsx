import type { Metadata } from "next";
import ArticleList from "../_components/articles/ArticleList";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "記事一覧 | SynapSoul",
  description:
    "読書と本に関する様々なトピックのSEO最適化記事を提供します。効果的な読書法、おすすめの本、著者インタビューなど、幅広い内容をカバーしています。",
};

export default async function ArticlesPage() {
  const articles = await api.article.getAll();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
        <Link href="/articles/create">
          <Button className="bg-green-600">記事作成</Button>
        </Link>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}
