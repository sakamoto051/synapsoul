// src/server/api/routers/timelineGroup.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const timelineGroupRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        bookId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timelineGroup.create({
        data: {
          title: input.title,
          bookId: input.bookId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timelineGroup.update({
        where: { id: input.id },
        data: { title: input.title },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timelineGroup.delete({
        where: { id: input.id },
      });
    }),

  getByBookId: protectedProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.timelineGroup.findMany({
        where: { bookId: input.bookId },
        include: { timelines: true },
      });
    }),
});
