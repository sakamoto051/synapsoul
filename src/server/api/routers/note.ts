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

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findUnique({
        where: { id: input.id },
      });
      if (!note) {
        throw new Error("Note not found");
      }
      return note;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedNote = await ctx.db.note.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });
      return updatedNote;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedNote = await ctx.db.note.delete({
        where: { id: input.id },
      });
      return deletedNote;
    }),
});
