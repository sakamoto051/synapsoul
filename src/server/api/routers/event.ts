import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        timelineId: z.number(),
        characterId: z.number(),
        title: z.string(),
        content: z.string(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.create({
        data: {
          title: input.title,
          content: input.content,
          startTime: input.startTime,
          endTime: input.endTime,
          characterId: input.characterId,
          timelineId: input.timelineId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          startTime: input.startTime,
          endTime: input.endTime,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.delete({
        where: { id: input.id },
      });
    }),

  getByTimelineId: protectedProcedure
    .input(z.object({ timelineId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: { timelineId: input.timelineId },
        include: { character: true },
      });
    }),
});
