import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookThreadRouter = createTRPCRouter({
  getThread: publicProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.bookThread.findUnique({
        where: { id: input.threadId },
        include: { 
          comments: {
            include: {
              replies: {
                include: {
                  replies: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
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
    .input(z.object({ isbn: z.string(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bookThread.create({
        data: input,
      });
    }),

  createComment: publicProcedure
    .input(z.object({ threadId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: input,
      });
    }),
  
  createReply: publicProcedure
    .input(z.object({ 
      threadId: z.string(),
      parentId: z.string(),
      content: z.string() 
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.content,
          threadId: input.threadId,
          parentId: input.parentId
        },
      });
    }),

});