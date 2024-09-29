import { getServerSideSitemap } from "next-sitemap";
import { db } from "~/server/db";

export async function GET() {
  // 全ての書籍のISBNを取得
  const books = await db.book.findMany({
    select: { isbn: true },
    distinct: ["isbn"],
  });

  // 全ての記事のIDを取得
  const articles = await db.article.findMany({
    select: { id: true },
  });

  const fields = [
    ...books.map((book) => ({
      loc: `https://synapsoul.vercel.app/books/${book.isbn}`,
      lastmod: new Date().toISOString(),
    })),
    ...articles.map((article) => ({
      loc: `https://synapsoul.vercel.app/articles/${article.id}`,
      lastmod: new Date().toISOString(),
    })),
  ];

  // getServerSideSitemapをサーバーアクションとして使用
  return getServerSideSitemap(fields);
}
