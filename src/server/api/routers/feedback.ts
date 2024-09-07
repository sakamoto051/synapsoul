// src/server/api/routers/feedback.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.feedback.create({
        data: {
          content: input.content,
          user: {
            connect: {
              id: Number(ctx.session.user.id),
            },
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.feedback.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }),
});
