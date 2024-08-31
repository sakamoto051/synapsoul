import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const bookThreadRouter = createTRPCRouter({
  getThread: publicProcedure
    .input(z.object({ threadId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.bookThread.findUnique({
        where: { id: input.threadId },
        include: {
          comments: {
            include: {
              likes: true,
              replies: {
                include: {
                  likes: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }),

  getThreads: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.bookThread.findMany({
        where: { isbn: input.isbn },
        include: { comments: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  createThread: publicProcedure
    .input(
      z.object({ isbn: z.string(), title: z.string(), content: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookThread.create({
        data: input,
      });
    }),

  createComment: publicProcedure
    .input(z.object({ threadId: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: input,
      });
    }),

  createReply: publicProcedure
    .input(
      z.object({
        threadId: z.number(),
        parentId: z.number(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.content,
          threadId: input.threadId,
          parentId: input.parentId,
        },
      });
    }),

  deleteComment: publicProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.delete({
        where: { id: input.commentId },
      });
    }),

  editComment: publicProcedure
    .input(z.object({ commentId: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.update({
        where: { id: input.commentId },
        data: { content: input.content },
      });
    }),

  likeComment: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      const existingLike = await ctx.db.like.findUnique({
        where: {
          commentId_userId: {
            commentId: input.commentId,
            userId: userId,
          },
        },
      });

      if (existingLike) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already liked this comment",
        });
      }

      return ctx.db.like.create({
        data: {
          commentId: input.commentId,
          userId: userId,
        },
      });
    }),

  unlikeComment: publicProcedure
    .input(z.object({ commentId: z.number(), userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.deleteMany({
        where: {
          commentId: input.commentId,
          userId: input.userId,
        },
      });
    }),
});
