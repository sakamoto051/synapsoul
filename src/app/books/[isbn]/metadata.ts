import type { Metadata } from "next";
import type { BookItem, BookResponse } from "~/types/book";

export async function fetchBookData(isbn: string): Promise<BookItem | null> {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;
  try {
    const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as BookResponse;
    return data.Items?.[0]?.Item ?? null;
  } catch (error) {
    // console.error("Error fetching book details:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { isbn: string };
}): Promise<Metadata> {
  const book = await fetchBookData(params.isbn);

  if (!book) {
    return {
      title: "書籍が見つかりません",
    };
  }

  return {
    title: `${book.title} | 書籍詳細`,
    description: book.itemCaption || `${book.title}の詳細情報と読書ノート`,
    openGraph: {
      title: `${book.title} | SynapsoulBooks`,
      description:
        book.itemCaption ||
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
}
