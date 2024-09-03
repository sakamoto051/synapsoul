import BookDetailClient from "./BookDetailClient";
import { generateMetadata } from "./metadata";
import type { Metadata } from "next";

export const metadata = async ({
  params,
}: { params: { isbn: string } }): Promise<Metadata> => {
  return generateMetadata({ params });
};

export default function BookDetailPage({
  params,
}: { params: { isbn: string } }) {
  return <BookDetailClient isbn={params.isbn} />;
}
