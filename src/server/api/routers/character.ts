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
        name: z.string(),
        color: z.string(),
        age: z.number().nullable(),
        gender: z.string().nullable(),
        personality: z.string().nullable(),
        background: z.string().nullable(),
        relationships: z.string().nullable(),
        bookId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          color: input.color,
          age: input.age,
          gender: input.gender,
          personality: input.personality,
          background: input.background,
          relationships: input.relationships,
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
        age: z.number().nullable(),
        gender: z.string().nullable(),
        personality: z.string().nullable(),
        background: z.string().nullable(),
        relationships: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.character.update({
        where: { id },
        data,
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
