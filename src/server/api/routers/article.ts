import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const articleRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.article.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { publishDate: "desc" },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await ctx.db.article.findUnique({
        where: { slug: input.slug },
        include: { user: { select: { name: true } } },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      return article;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.article.create({
        data: {
          ...input,
          publishDate: new Date(),
          userId: Number(ctx.session.user.id),
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const article = await ctx.db.article.findUnique({
        where: { id },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (article.userId !== Number(ctx.session.user.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this article",
        });
      }

      return ctx.db.article.update({
        where: { id },
        data: updateData,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.db.article.findUnique({
        where: { id: input.id },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      if (article.userId !== Number(ctx.session.user.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete this article",
        });
      }

      return ctx.db.article.delete({
        where: { id: input.id },
      });
    }),
});
