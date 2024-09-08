import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { fetchBookInfoFromAPI } from "~/lib/bookApi";

export const bookAPIRouter = createTRPCRouter({
  getByIsbn: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .query(async ({ ctx, input }) => {
      // First, check if the book exists in the BookAPI table
      let bookAPI = await ctx.db.bookAPI.findUnique({
        where: { isbn: input.isbn },
      });

      if (bookAPI) {
        // If book exists in DB, fetch from API asynchronously and update DB
        const data = await fetchAndFormatBookInfo(input.isbn);
        if (!data) return bookAPI;

        ctx.db.bookAPI
          .update({
            where: { isbn: input.isbn },
            data: data,
          })
          .catch(console.error); // Log any errors but don't wait for completion
        return bookAPI;
      }

      // If not in DB, fetch from API
      const apiData = await fetchAndFormatBookInfo(input.isbn);
      if (apiData) {
        bookAPI = await ctx.db.bookAPI.create({
          data: apiData,
        });
        return bookAPI;
      }

      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Book not found in API",
      });
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
});

async function fetchAndFormatBookInfo(isbn: string) {
  const apiData = await fetchBookInfoFromAPI(isbn);
  if (!apiData) return null;
  console.log(apiData);

  return {
    isbn: isbn,
    affiliateUrl: apiData.affiliateUrl,
    author: apiData.author,
    authorKana: apiData.authorKana,
    availability: apiData.availability,
    booksGenreId: apiData.booksGenreId,
    chirayomiUrl: apiData.chirayomiUrl,
    contents: apiData.contents,
    discountPrice: apiData.discountPrice,
    discountRate: apiData.discountRate,
    itemCaption: apiData.itemCaption,
    itemPrice: apiData.itemPrice,
    itemUrl: apiData.itemUrl,
    largeImageUrl: apiData.largeImageUrl,
    limitedFlag: apiData.limitedFlag,
    listPrice: apiData.listPrice,
    mediumImageUrl: apiData.mediumImageUrl,
    postageFlag: apiData.postageFlag,
    publisherName: apiData.publisherName,
    reviewAverage: apiData.reviewAverage,
    reviewCount: apiData.reviewCount,
    salesDate: apiData.salesDate,
    seriesName: apiData.seriesName,
    seriesNameKana: apiData.seriesNameKana,
    size: apiData.size,
    smallImageUrl: apiData.smallImageUrl,
    subTitle: apiData.subTitle,
    subTitleKana: apiData.subTitleKana,
    title: apiData.title,
    titleKana: apiData.titleKana,
  };
}
