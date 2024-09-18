// src/server/api/routers/character.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  getByTimelineGroupId: protectedProcedure
    .input(z.object({ timelineGroupId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.character.findMany({
        where: { timelineGroupId: input.timelineGroupId },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        timelineGroupId: z.number(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          color: input.color,
          timelineGroupId: input.timelineGroupId,
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
