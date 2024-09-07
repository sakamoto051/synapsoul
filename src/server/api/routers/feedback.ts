import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const feedbackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.feedback.create({
        data: {
          content: input.content,
          userId: Number(ctx.session.user.id),
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.feedback.findMany({
      include: { user: true, feedbackReactions: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // 新しい削除プロシージャを追加
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const feedback = await ctx.db.feedback.findUnique({
        where: { id: input.id },
      });

      if (!feedback) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feedback not found",
        });
      }

      if (feedback.userId !== Number(ctx.session.user.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own feedback",
        });
      }

      return ctx.db.feedback.delete({
        where: { id: input.id },
      });
    }),

  upsertReaction: protectedProcedure
    .input(
      z.object({
        feedbackId: z.number(),
        type: z.union([z.literal("LIKE"), z.literal("DISLIKE")]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.feedbackReaction.upsert({
        where: {
          feedbackId_userId: {
            feedbackId: input.feedbackId,
            userId: Number(ctx.session.user.id),
          },
        },
        update: {
          type: input.type,
        },
        create: {
          feedbackId: input.feedbackId,
          userId: Number(ctx.session.user.id),
          type: input.type,
        },
      });
    }),

  addReaction: protectedProcedure
    .input(
      z.object({ feedbackId: z.number(), type: z.enum(["LIKE", "DISLIKE"]) }),
    )
    .mutation(async ({ ctx, input }) => {
      const { feedbackId, type } = input;
      const userId = Number(ctx.session.user.id);

      return ctx.db.feedbackReaction.upsert({
        where: {
          feedbackId_userId: {
            feedbackId,
            userId,
          },
        },
        update: { type },
        create: { feedbackId, userId, type },
      });
    }),

  removeReaction: protectedProcedure
    .input(z.object({ feedbackId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { feedbackId } = input;
      const userId = Number(ctx.session.user.id);

      return ctx.db.feedbackReaction.delete({
        where: {
          feedbackId_userId: {
            feedbackId,
            userId,
          },
        },
      });
    }),
});
