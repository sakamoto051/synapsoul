// src/lib/bookImportService.ts

import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { BookStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import type {
  ExternalBookStoresResponse,
  ImportBooksResult,
} from "@/types/bookMeter";

const BOOK_TYPES = [
  { url: "read", status: BookStatus.FINISHED },
  { url: "reading", status: BookStatus.READING },
  { url: "stacked", status: BookStatus.TO_READ },
  { url: "wish", status: BookStatus.INTERESTED },
];

export async function importUserBooks(
  bookMakerId: number,
  userId: number,
  progressCallback: (progress: number) => void,
): Promise<ImportBooksResult> {
  let totalBooks = 0;
  let processedBooks = 0;
  let successfulImports = 0;
  let failedImports = 0;

  // First, calculate the total number of books
  for (const bookType of BOOK_TYPES) {
    const count = await getBookCount(bookMakerId, bookType.url);
    totalBooks += count;
  }

  try {
    for (const bookType of BOOK_TYPES) {
      const { successful, failed } = await importBooksByType(
        bookMakerId,
        userId,
        bookType.url,
        bookType.status,
        () => {
          processedBooks++;
          const overallProgress = (processedBooks / totalBooks) * 100;
          progressCallback(Math.round(overallProgress));
        },
      );
      successfulImports += successful;
      failedImports += failed;
    }

    return { totalBooks, processedBooks, successfulImports, failedImports };
  } catch (error) {
    console.error("Error in importUserBooks:", error);
    throw error;
  }
}

async function getBookCount(
  bookMakerId: number,
  bookTypeUrl: string,
): Promise<number> {
  const firstPageUrl = `https://bookmeter.com/users/${bookMakerId}/books/${bookTypeUrl}?page=1`;
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
      return Number.parseInt(match[1] ?? "", 10);
    }
  }
  return 0;
}

async function importBooksByType(
  bookMakerId: number,
  userId: number,
  bookTypeUrl: string,
  bookStatus: BookStatus,
  progressCallback: (progress: number) => void,
): Promise<{
  processed: number;
  successful: number;
  failed: number;
}> {
  let processed = 0;
  let successful = 0;
  let failed = 0;

  try {
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const url = `https://bookmeter.com/users/${bookMakerId}/books/${bookTypeUrl}?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const bookLinks = document.querySelectorAll(
        '.book__detail .detail__title a[href^="/books/"]',
      );
      for (const link of bookLinks) {
        const bookId = link.getAttribute("href")?.split("/")[2];
        if (bookId) {
          const result = await processBook(bookId, userId, bookStatus);
          processed++;
          if (result) {
            successful++;
          } else {
            failed++;
          }
          progressCallback(processed);
        }
      }

      const nextPageLink = document.querySelector(
        '.bm-pagination__link[rel="next"]',
      );
      hasNextPage = !!nextPageLink;
      page++;
    }

    return { processed, successful, failed };
  } catch (error) {
    console.error(`Error in importBooksByType (${bookTypeUrl}):`, error);
    throw error;
  }
}

async function processBook(
  bookId: string,
  userId: number,
  status: BookStatus,
): Promise<boolean> {
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
        await saveBookToDatabase(isbn, userId, status);
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

async function saveBookToDatabase(
  isbn: string,
  userId: number,
  status: BookStatus,
): Promise<void> {
  try {
    await prisma.book.upsert({
      where: {
        isbn_userId: {
          isbn: isbn,
          userId: userId,
        },
      },
      update: { status: status },
      create: {
        isbn: isbn,
        userId: userId,
        status: status,
      },
    });
  } catch (error) {
    console.error(`Error saving book with ISBN ${isbn}:`, error);
    throw error;
  }
}
