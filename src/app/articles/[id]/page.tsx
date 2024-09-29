import type { Metadata } from "next";
import ArticleContent from "../../_components/articles/ArticleContent";
import { api } from "~/trpc/server";

export async function generateMetadata({
  params,
}: { params: { id: string } }): Promise<Metadata> {
  const article = await api.article.getById({ id: Number(params.id) });

  return {
    title: `${article.title} | SynapSoul`,
    description: article.description,
    keywords: article.keywords,
  };
}

export default async function ArticlePage({
  params,
}: { params: { id: string } }) {
  const article = await api.article.getById({ id: Number(params.id) });

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleContent article={article} />
    </div>
  );
}
