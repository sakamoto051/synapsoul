// src/server/api/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateDisplayName: protectedProcedure
    .input(z.object({ displayName: z.string().min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: { displayName: input.displayName },
      });
      return updatedUser;
    }),
});
