// src/app/books/[isbn]/metadata.ts
import type { Metadata } from "next";
import type { BookItem, BookResponse } from "~/types/book";

export async function generateMetadata({
  params,
}: { params: { isbn: string } }): Promise<Metadata> {
  const isbn = params.isbn;
  const book: BookItem | null = await fetchBookData(isbn);

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
          url:
            book.largeImageUrl ||
            "https://your-domain.com/default-book-image.jpg",
          width: 800,
          height: 600,
          alt: `${book.title}の表紙`,
        },
      ],
    },
  };
}

async function fetchBookData(isbn: string) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;
  try {
    const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as BookResponse;
    return data.Items?.[0]?.Item ?? null;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}
