import React from "react";
import Link from "next/link";
import type { Article } from "@prisma/client";
import ArticleEditButton from "./ArticleEditButton";
import ArticleDeleteButton from "./ArticleDeleteButton";

interface ArticleListProps {
  articles: (Article & { user: { id: number; name: string | null } })[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  // 日付をyyyy/mm/dd形式にフォーマットする関数
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  };
  console.log(articles);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles?.map((article) => (
        <div
          key={article.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            <Link href={`/articles/${article.id}`} className="hover:underline">
              {article.title}
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {article.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            公開日: {formatDate(new Date(article.publishDate))}
          </p>
          <ArticleEditButton article={article} />
          <ArticleDeleteButton article={article} />
        </div>
      ))}
    </div>
  );
}
