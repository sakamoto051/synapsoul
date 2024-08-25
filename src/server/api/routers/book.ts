import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { BookStatus } from "@prisma/client";
import { TRPCError } from '@trpc/server';

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
});