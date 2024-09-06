// lib/bookImportService.ts (サーバーサイド)
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { BookStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import type {
  ExternalBookStoresResponse,
  ImportBooksResult,
} from "@/types/bookMeter";

export async function importUserBooks(
  bookMakerId: number,
  userId: number,
): Promise<ImportBooksResult> {
  let page = 1;
  let hasNextPage = true;
  let totalBooks = 0;
  let processedBooks = 0;
  let successfulImports = 0;
  let failedImports = 0;

  try {
    // 総本数を取得
    const firstPageUrl = `https://bookmeter.com/users/${bookMakerId}/books/read?page=1`;
    const firstPageResponse = await fetch(firstPageUrl);
    if (!firstPageResponse.ok) {
      throw new Error(`HTTP error! status: ${firstPageResponse.status}`);
    }
    const firstPageHtml = await firstPageResponse.text();
    const firstPageDom = new JSDOM(firstPageHtml);
    const firstPageDocument = firstPageDom.window.document;
    const totalBooksElement = firstPageDocument.querySelector(
      ".bm-pagination-notice",
    );
    if (totalBooksElement) {
      const match = totalBooksElement.textContent?.match(/全(\d+)件/);
      if (match) {
        totalBooks = Number.parseInt(match[1] ?? "", 10);
      }
    }

    while (hasNextPage) {
      const url = `https://bookmeter.com/users/${bookMakerId}/books/read?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const bookLinks = document.querySelectorAll('a[href^="/books/"]');
      for (const link of bookLinks) {
        const bookId = link.getAttribute("href")?.split("/")[2];
        if (bookId) {
          const result = await processBook(bookId, userId);
          processedBooks++;
          if (result) {
            successfulImports++;
          } else {
            failedImports++;
          }
        }
      }

      const nextPageLink = document.querySelector(
        '.bm-pagination__link[rel="next"]',
      );
      hasNextPage = !!nextPageLink;
      page++;
    }

    return { totalBooks, processedBooks, successfulImports, failedImports };
  } catch (error) {
    console.error("Error in importUserBooks:", error);
    throw error;
  }
}

async function processBook(bookId: string, userId: number): Promise<boolean> {
  try {
    const url = `https://bookmeter.com/api/v1/books/${bookId}/external_book_stores.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as ExternalBookStoresResponse;
    const kinokuniyaStore = data.resources.find(
      (store) => store.alphabet_name === "kinokuniya",
    );
    if (kinokuniyaStore) {
      const isbn = extractIsbnFromUrl(kinokuniyaStore.url);
      if (isbn) {
        await saveBookToDatabase(isbn, userId);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing book ${bookId}:`, error);
    return false;
  }
}

function extractIsbnFromUrl(url: string): string | null | undefined {
  const match = url.match(/bm=(\d+)/);
  return match ? match[1] : null;
}

async function saveBookToDatabase(isbn: string, userId: number): Promise<void> {
  try {
    await prisma.book.upsert({
      where: {
        isbn_userId: {
          isbn: isbn,
          userId: userId,
        },
      },
      update: { status: "FINISHED" },
      create: {
        isbn: isbn,
        userId: userId,
        status: BookStatus.FINISHED,
      },
    });
  } catch (error) {
    console.error(`Error saving book with ISBN ${isbn}:`, error);
    throw error;
  }
}
