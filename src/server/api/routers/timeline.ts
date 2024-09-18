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
          date: true,
          timelineGroup: {
            select: {
              id: true,
              bookId: true,
            },
          },
        },
      });

      if (!timeline) {
        throw new Error("Timeline not found");
      }

      return {
        id: timeline.id,
        date: timeline.date,
        timelineGroupId: timeline.timelineGroup.id,
        bookId: timeline.timelineGroup.bookId,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        timelineGroupId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.create({
        data: {
          date: input.date,
          timelineGroupId: input.timelineGroupId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.update({
        where: { id: input.id },
        data: { date: input.date },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.delete({
        where: { id: input.id },
      });
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
          timelineGroup: {
            include: {
              book: true,
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

  getByGroupId: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.timeline.findMany({
        where: { timelineGroupId: input.groupId },
        include: { events: { include: { character: true } } },
      });
    }),
});
