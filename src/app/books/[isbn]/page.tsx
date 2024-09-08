import BookDetailClient from "./BookDetailClient";
import { api } from "~/trpc/server";
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { isbn: string };
}): Promise<Metadata> => {
  const book = await api.bookAPI.getByIsbn({ isbn: params.isbn });

  if (!book) {
    return {
      title: "書籍が見つかりません",
    };
  }

  return {
    title: `${book.title} | 書籍詳細`,
    description: book.itemCaption ?? `${book.title}の詳細情報と読書ノート`,
    openGraph: {
      title: `${book.title} | SynapsoulBooks`,
      description:
        book.itemCaption ??
        `${book.title}の詳細情報と読書ノート - SynapsoulBooks`,
      images: [
        {
          url: book.largeImageUrl,
          width: 800,
          height: 600,
          alt: `${book.title}の表紙`,
        },
      ],
    },
  };
};

export default async function BookDetailPage({
  params,
}: {
  params: { isbn: string };
}) {
  const book = await api.bookAPI.getByIsbn({ isbn: params.isbn });

  if (!book) {
    return <div>書籍が見つかりません</div>;
  }

  return <BookDetailClient isbn={params.isbn} initialBook={book} />;
}
