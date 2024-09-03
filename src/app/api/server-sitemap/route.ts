import { getServerSideSitemap } from "next-sitemap";
import { db } from "~/server/db";

export async function GET() {
  // 全ての書籍のISBNを取得
  const books = await db.book.findMany({
    select: { isbn: true },
    distinct: ["isbn"],
  });

  const fields = books.map((book) => ({
    loc: `https://synapsoul.vercel.app/books/${book.isbn}`,
    lastmod: new Date().toISOString(),
  }));

  // getServerSideSitemapをサーバーアクションとして使用
  return getServerSideSitemap(fields);
}
