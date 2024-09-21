// src/server/api/routers/timeline.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const timelineRouter = createTRPCRouter({
  getBasicInfo: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const timeline = await ctx.db.timeline.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          title: true,
          date: true,
          bookId: true,
        },
      });

      if (!timeline) {
        throw new Error("Timeline not found");
      }

      return timeline;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const timeline = await ctx.db.timeline.findUnique({
        where: { id: input.id },
        include: {
          events: {
            include: {
              character: true,
            },
          },
          book: {
            include: {
              characters: true,
            },
          },
        },
      });

      if (!timeline) {
        throw new Error("Timeline not found");
      }

      return timeline;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.date(),
        bookId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.create({
        data: {
          title: input.title,
          date: input.date,
          bookId: input.bookId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.update({
        where: { id: input.id },
        data: { title: input.title, date: input.date },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.delete({
        where: { id: input.id },
      });
    }),

  getByBookId: protectedProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.timeline.findMany({
        where: { bookId: input.bookId },
        include: { events: { include: { character: true } } },
      });
    }),
});
