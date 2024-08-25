import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  list: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.tag.findMany()
    }),
});
