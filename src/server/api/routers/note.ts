import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        bookId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.db.book.findFirst({
        where: {
          id: input.bookId,
          userId: Number(ctx.session.user.id),
        },
      });

      if (!book) {
        throw new Error("Book not found or you don't have permission");
      }

      return ctx.db.note.create({
        data: {
          title: input.title,
          content: input.content,
          book: {
            connect: { id: input.bookId },
          },
        },
      });
    }),
});
