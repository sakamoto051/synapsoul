import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type BookAPI, BookStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { BookResponse, BookWithDetails } from "~/types/book";
import { importUserBooks } from "~/lib/bookImportService";
import { db } from "~/server/db";
import { kv } from "@vercel/kv";
import type { ImportJobStatus } from '~/types/importJob';

const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

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
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.waitForToken();
    }
    this.tokenBucket--;
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefilled;
    const refillAmount = timePassed * (this.refillRate / 1000);
    this.tokenBucket = Math.min(
      this.maxTokens,
      this.tokenBucket + refillAmount,
    );
    this.lastRefilled = now;
  }
}

const rateLimiter = new RateLimiter(5, 1); // 5 requests per second

async function fetchWithTimeout(
  resource: string,
  options: RequestInit = {},
  timeout = 5000,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

async function fetchBookInfo(isbn: string): Promise<BookAPI | null> {
  // First, check if the book exists in the BookAPI table
  let bookAPI: BookAPI | null = await db.bookAPI.findUnique({
    where: { isbn },
  });

  if (!bookAPI) {
    // If not in DB, fetch from API
    await rateLimiter.waitForToken();

    try {
      const response = await fetchWithTimeout(`${API_ENDPOINT}&isbn=${isbn}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as BookResponse;
      if (data.Items && data.Items.length > 0 && data.Items[0]) {
        const apiBookInfo = data.Items[0].Item;

        // Save the API data to BookAPI table
        bookAPI = await db.bookAPI.create({
          data: {
            isbn: isbn,
            affiliateUrl: apiBookInfo.affiliateUrl,
            author: apiBookInfo.author,
            authorKana: apiBookInfo.authorKana,
            availability: apiBookInfo.availability,
            booksGenreId: apiBookInfo.booksGenreId,
            chirayomiUrl: apiBookInfo.chirayomiUrl,
            contents: apiBookInfo.contents,
            discountPrice: apiBookInfo.discountPrice,
            discountRate: apiBookInfo.discountRate,
            itemCaption: apiBookInfo.itemCaption,
            itemPrice: apiBookInfo.itemPrice,
            itemUrl: apiBookInfo.itemUrl,
            largeImageUrl: apiBookInfo.largeImageUrl,
            limitedFlag: apiBookInfo.limitedFlag,
            listPrice: apiBookInfo.listPrice,
            mediumImageUrl: apiBookInfo.mediumImageUrl,
            postageFlag: apiBookInfo.postageFlag,
            publisherName: apiBookInfo.publisherName,
            reviewAverage: apiBookInfo.reviewAverage,
            reviewCount: apiBookInfo.reviewCount,
            salesDate: apiBookInfo.salesDate,
            seriesName: apiBookInfo.seriesName,
            seriesNameKana: apiBookInfo.seriesNameKana,
            size: apiBookInfo.size,
            smallImageUrl: apiBookInfo.smallImageUrl,
            subTitle: apiBookInfo.subTitle,
            subTitleKana: apiBookInfo.subTitleKana,
            title: apiBookInfo.title,
            titleKana: apiBookInfo.titleKana,
          },
        });
      }
    } catch (error) {
      console.error(`Error fetching book info for ISBN ${isbn}:`, error);
      return null;
    }
  }

  if (!bookAPI) {
    return null;
  }

  return bookAPI;

  // // Convert BookAPI to BookWithDetails
  // const bookWithDetails: BookWithDetails = {
  //   id: 0, // This will be set when creating a user's book
  //   isbn: bookAPI.isbn,
  //   title: bookAPI.title,
  //   author: bookAPI.author ?? "",
  //   publisherName: bookAPI.publisherName ?? "",
  //   largeImageUrl: bookAPI.largeImageUrl ?? "",
  //   itemCaption: bookAPI.itemCaption ?? "",
  //   salesDate: bookAPI.salesDate ?? "",
  //   itemPrice: bookAPI.itemPrice ?? 0,
  //   status: "INTERESTED", // Default status
  //   userId: 0, // This will be set when creating a user's book
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

  // return bookWithDetails;
}

export const bookRouter = createTRPCRouter({
  getStatus: publicProcedure
    .input(
      z.object({
        isbn: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        return null;
      }

      const book = await ctx.db.book.findUnique({
        where: {
          isbn_userId: {
            isbn: input.isbn,
            userId: Number(ctx.session.user.id),
          },
        },
        select: { status: true },
      });

      return book?.status ?? null;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        isbn: z.string(),
        status: z.nativeEnum(BookStatus).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be logged in to perform this action",
        });
      }

      if (input.status === null) {
        // Remove the book from user's books
        await ctx.db.book.delete({
          where: {
            isbn_userId: {
              isbn: input.isbn,
              userId: userId,
            },
          },
        });
        return { success: true, message: "Book removed from user's books" };
      }

      // Create or update the user's book
      const updatedBook = await ctx.db.book.upsert({
        where: {
          isbn_userId: {
            isbn: input.isbn,
            userId: userId,
          },
        },
        update: {
          status: input.status,
        },
        create: {
          isbn: input.isbn,
          userId: userId,
          status: input.status,
        },
      });

      return updatedBook;
    }),

  getUserBooks: protectedProcedure.query(async ({ ctx }) => {
    try {
      const books = await ctx.db.book.findMany({
        where: {
          userId: Number(ctx.session.user.id),
        },
      });

      const booksWithInfo = await Promise.all(
        books.map(async (book) => {
          const bookInfo = await fetchBookInfo(book.isbn);
          if (!bookInfo) {
            // console.warn(
            //   `Failed to fetch info for book with ISBN: ${book.isbn}`,
            // );
            return null;
          }
          return {
            ...bookInfo,
            ...book, // Overwrite with database values
          };
        }),
      );

      const validBooks = booksWithInfo.filter(
        (book): book is BookWithDetails => book !== null,
      );

      // console.log(
      //   `Successfully fetched info for ${validBooks.length} out of ${books.length} books`,
      // );

      return validBooks;
    } catch (error) {
      // console.error("Error in getUserBooks:", error);
      // throw new TRPCError({
      //   code: "INTERNAL_SERVER_ERROR",
      //   message: "An error occurred while fetching user books",
      // });
    }
  }),

  getByIsbn: protectedProcedure
    .input(z.object({ isbn: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.book.findUnique({
        where: {
          isbn_userId: {
            isbn: input.isbn,
            userId: Number(ctx.session.user.id),
          },
        },
        include: { notes: { orderBy: { updatedAt: "desc" } } },
      });
    }),

  importBooks: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bookMakerId = Number(input.userId);
      const userId = Number(ctx.session.user.id);

      // 進捗を追跡するための関数を作成
      const progressCallback = (progress: number) => {
        // WebSocketやServer-Sent Eventsを使用して、クライアントに進捗を送信
        // ここでは簡単のため、コンソールにログを出力
        console.log(`Import progress: ${progress}%`);
      };

      const result = await importUserBooks(
        bookMakerId,
        userId,
        progressCallback,
      );
      return result;
    }),

  startImportBooks: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const jobId = `import-${ctx.session.user.id}-${Date.now()}`;
      await kv.set(jobId, { status: "started", progress: 0 });

      // バックグラウンドでインポート処理を開始
      void importBooksBackground(
        jobId,
        input.userId,
        Number(ctx.session.user.id),
      );

      return { jobId };
    }),

  getImportStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input }): Promise<ImportJobStatus | null> => {
      const status = await kv.get<ImportJobStatus>(input.jobId);
      return status;
    }),
});

async function importBooksBackground(
  jobId: string,
  bookMakerId: string,
  userId: number,
) {
  try {
    const result = await importUserBooks(
      Number(bookMakerId),
      userId,
      async (progress) => {
        await kv.set(jobId, { status: "processing", progress });
      },
    );
    await kv.set(jobId, { status: "completed", result });
  } catch (error) {
    await kv.set(jobId, {
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
