import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { BookStatus } from "@prisma/client";
import { TRPCError } from '@trpc/server';
import { BookResponse, BookWithDetails } from '~/types/book';
import NodeCache from 'node-cache';

const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;
const CACHE_TTL = 60 * 60 * 24; // 24 hours
const bookCache = new NodeCache({ stdTTL: CACHE_TTL });

class RateLimiter {
  private tokenBucket: number;
  private lastRefilled: number;
  private maxTokens: number;
  private refillRate: number;

  constructor(maxTokens: number, refillRate: number) {
    this.tokenBucket = maxTokens;
    this.lastRefilled = Date.now();
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  async waitForToken(): Promise<void> {
    this.refillTokens();
    if (this.tokenBucket < 1) {
      const waitTime = (1 / this.refillRate) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForToken();
    }
    this.tokenBucket--;
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefilled;
    const refillAmount = timePassed * (this.refillRate / 1000);
    this.tokenBucket = Math.min(this.maxTokens, this.tokenBucket + refillAmount);
    this.lastRefilled = now;
  }
}

const rateLimiter = new RateLimiter(5, 1); // 5 requests per second

async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

async function fetchBookInfo(isbn: string): Promise<BookWithDetails | null> {
  const cachedBook = bookCache.get<BookWithDetails>(isbn);
  if (cachedBook) {
    return cachedBook;
  }

  await rateLimiter.waitForToken();

  try {
    const response = await fetchWithTimeout(`${API_ENDPOINT}&isbn=${isbn}`);
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit exceeded. Waiting before retry...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return fetchBookInfo(isbn); // Retry after waiting
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: BookResponse = await response.json();
    if (data.Items && data.Items.length > 0 && data.Items[0]) {
      const bookInfo: BookWithDetails = {
        ...data.Items[0].Item,
        isbn: isbn,
        status: 'INTERESTED', // Default status, adjust as needed
        userId: '', // This will be set later
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      bookCache.set(isbn, bookInfo);
      return bookInfo;
    }
    console.warn(`No book info found for ISBN: ${isbn}`);
    return null;
  } catch (error) {
    console.error(`Error fetching book info for ISBN ${isbn}:`, error);
    return null;
  }
}

export const bookRouter = createTRPCRouter({
  getStatus: publicProcedure
    .input(z.object({
      isbn: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        return null;
      }
      const userId = ctx.session.user.id;

      const book = await ctx.db.book.findUnique({
        where: {
          isbn_userId: {
            isbn: input.isbn,
            userId: userId,
        } },
        select: { status: true },
      });

      return book?.status || null;
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      isbn: z.string(),
      status: z.nativeEnum(BookStatus),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be logged in to perform this action",
        });
      }
      console.log(userId)
      console.log(input.isbn)

      try {
        const upsertedBook = await ctx.db.book.upsert({
          where: {
            isbn_userId: {
              isbn: input.isbn,
              userId: userId,
            },
          },
          update: {
            status: input.status,
            updatedAt: new Date(),
          },
          create: {
            isbn: input.isbn,
            status: input.status,
            userId: userId,
          },
        });

        return upsertedBook;
      } catch (error) {
        console.error("Error in upsertBook:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while upserting the book",
        });
      }
    }),
  
  getUserBooks: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const books = await ctx.db.book.findMany({
          where: {
            userId: ctx.session.user.id,
          },
        });

        const booksWithInfo = await Promise.all(
          books.map(async (book) => {
            const bookInfo = await fetchBookInfo(book.isbn);
            if (!bookInfo) {
              console.warn(`Failed to fetch info for book with ISBN: ${book.isbn}`);
              return null;
            }
            return {
              ...bookInfo,
              ...book, // Overwrite with database values
            };
          })
        );

        const validBooks = booksWithInfo.filter((book): book is BookWithDetails => book !== null);

        console.log(`Successfully fetched info for ${validBooks.length} out of ${books.length} books`);

        return validBooks;
      } catch (error) {
        console.error("Error in getUserBooks:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching user books",
        });
      }
    }),
});