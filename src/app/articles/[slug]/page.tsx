import type { Metadata } from "next";
import ArticleContent from "../../_components/articles/ArticleContent";
import { api } from "~/trpc/server";

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata> {
  const article = await api.article.getBySlug({ slug: params.slug });
  return {
    title: `${article.title} | SynapSoul`,
    description: article.excerpt,
    keywords: article.keyward,
  };
}

export default async function ArticlePage({
  params,
}: { params: { slug: string } }) {
  const article = await api.article.getBySlug({ slug: params.slug });

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleContent article={article} />
    </div>
  );
}
