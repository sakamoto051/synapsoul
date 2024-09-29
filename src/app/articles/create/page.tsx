"use client";

import CreateArticleForm from "~/app/_components/articles/CreateArticleForm";

export default function CreateArticlePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">新しい記事を作成</h1>
      <CreateArticleForm />
    </div>
  );
}
