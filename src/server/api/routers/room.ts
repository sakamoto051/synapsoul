import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  list: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.room.findMany({
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        }
      })
    }),
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      tags: z.array(z.string().min(1)),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.room.create({
        data: {
          title: input.title,
          content: input.content,
          tags: { create: input.tags.map(tag => ({ name: tag }))},
          owner: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});
