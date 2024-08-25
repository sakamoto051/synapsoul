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
      tags: z.array(z.object({
        name: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const tagsToConnect = [];
      for (const tag of input.tags) {
        const existingTag = await ctx.db.tag.findFirst({
          where: { name: tag.name },
        });

        if (existingTag) {
          tagsToConnect.push({ id: existingTag.id });
        } else {
          const newTag = await ctx.db.tag.create({
            data: {
              name: tag.name,
            },
          });
          tagsToConnect.push({ id: newTag.id });
        }
      }

      return ctx.db.room.create({
        data: {
          title: input.title,
          content: input.content,
          tags: {
            connect: tagsToConnect,
          },
          owner: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});
