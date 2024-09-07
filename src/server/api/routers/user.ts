// src/server/api/routers/user.ts
import { TRPCError } from "@trpc/server";
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

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    try {
      // ユーザーに関連する全てのデータを削除
      await ctx.db.$transaction([
        ctx.db.feedbackReaction.deleteMany({
          where: { userId: Number(userId) },
        }),
        ctx.db.feedback.deleteMany({ where: { userId: Number(userId) } }),

        ctx.db.like.deleteMany({ where: { userId: Number(userId) } }),
        ctx.db.comment.deleteMany({ where: { userId: Number(userId) } }),

        ctx.db.note.deleteMany({ where: { userId: Number(userId) } }),
        ctx.db.book.deleteMany({ where: { userId: Number(userId) } }),

        ctx.db.chat.deleteMany({ where: { userId: Number(userId) } }),
        ctx.db.room.deleteMany({ where: { ownerId: Number(userId) } }),

        ctx.db.session.deleteMany({ where: { userId: Number(userId) } }),
        ctx.db.account.deleteMany({ where: { userId: Number(userId) } }),
        ctx.db.user.delete({ where: { id: Number(userId) } }),
      ]);

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "アカウントの削除中にエラーが発生しました",
      });
    }
  }),
});
