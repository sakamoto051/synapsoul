import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { fetchBookInfoFromAPI } from "~/lib/bookApi";
import type { BookItem, BookResponse } from "~/types/book";

const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

export const bookAPIRouter = createTRPCRouter({
  getByIsbn: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .query(async ({ ctx, input }) => {
      // First, check if the book exists in the BookAPI table
      let bookAPI = await ctx.db.bookAPI.findUnique({
        where: { isbn: input.isbn },
      });

      if (!bookAPI) {
        // If not in DB, fetch from API
        const apiData = await fetchBookInfoFromAPI(input.isbn);
        if (apiData) {
          try {
            bookAPI = await ctx.db.bookAPI.create({
              data: apiData,
            });
          } catch (error) {
            // If creation fails due to unique constraint, try to fetch again
            bookAPI = await ctx.db.bookAPI.findUnique({
              where: { isbn: input.isbn },
            });
            if (!bookAPI) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create or retrieve book data",
              });
            }
          }
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found in API",
          });
        }
      } else {
        // If book exists in DB, fetch from API asynchronously and update DB
        fetchBookInfoFromAPI(input.isbn)
          .then((apiData) => {
            if (apiData) {
              ctx.db.bookAPI
                .update({
                  where: { isbn: input.isbn },
                  data: apiData,
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }

      return bookAPI;
    }),

  update: protectedProcedure
    .input(
      z.object({
        isbn: z.string(),
        affiliateUrl: z.string().optional(),
        author: z.string().optional(),
        authorKana: z.string().optional(),
        availability: z.string().optional(),
        booksGenreId: z.string().optional(),
        chirayomiUrl: z.string().optional(),
        contents: z.string().optional(),
        discountPrice: z.number().optional(),
        discountRate: z.number().optional(),
        itemCaption: z.string().optional(),
        itemPrice: z.number().optional(),
        itemUrl: z.string().optional(),
        largeImageUrl: z.string().optional(),
        limitedFlag: z.number().optional(),
        listPrice: z.number().optional(),
        mediumImageUrl: z.string().optional(),
        postageFlag: z.number().optional(),
        publisherName: z.string().optional(),
        reviewAverage: z.string().optional(),
        reviewCount: z.number().optional(),
        salesDate: z.string().optional(),
        seriesName: z.string().optional(),
        seriesNameKana: z.string().optional(),
        size: z.string().optional(),
        smallImageUrl: z.string().optional(),
        subTitle: z.string().optional(),
        subTitleKana: z.string().optional(),
        title: z.string(),
        titleKana: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedBookAPI = await ctx.db.bookAPI.update({
        where: { isbn: input.isbn },
        data: input,
      });
      return updatedBookAPI;
    }),

  getPopularBooks: publicProcedure
    .input(z.object({ booksGenreId: z.string() }))
    .query(async ({ input }) => {
      console.log(input.booksGenreId);
      try {
        const response = await fetch(
          `${API_ENDPOINT}&sort=sales&hits=20&booksGenreId=${input.booksGenreId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BookResponse = (await response.json()) as BookResponse;
        const books: BookItem[] = data.Items.map((item) => item.Item);
        return books;
      } catch (error) {
        console.error("Error fetching popular books:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch popular books",
        });
      }
    }),
});
