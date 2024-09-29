import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Article } from "@prisma/client";

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  // 日付をyyyy/mm/dd形式にフォーマットする関数
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {article.title}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          公開日: {formatDate(new Date(article.publishDate))}
        </p>
      </CardHeader>
      <CardContent>
        <div className="markdown-body bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-gray-800 dark:text-gray-200" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-gray-800 dark:text-gray-200" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-gray-800 dark:text-gray-200" {...props} />
              ),
              h4: ({ ...props }) => (
                <h4 className="text-gray-800 dark:text-gray-200" {...props} />
              ),
              h5: ({ ...props }) => (
                <h5 className="text-gray-800 dark:text-gray-200" {...props} />
              ),
              h6: ({ ...props }) => (
                <h6 className="text-gray-800 dark:text-gray-200" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-gray-600 dark:text-gray-300" {...props} />
              ),
              a: ({ ...props }) => (
                <a
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal list-inside" {...props} />
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
