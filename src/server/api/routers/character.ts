// src/server/api/routers/character.ts (continued)
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  getByBookId: protectedProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.character.findMany({
        where: { bookId: input.bookId },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        bookId: z.number(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          color: input.color,
          bookId: input.bookId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.update({
        where: { id: input.id },
        data: {
          name: input.name,
          color: input.color,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.delete({
        where: { id: input.id },
      });
    }),
});
