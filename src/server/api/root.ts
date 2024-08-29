import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "./routers/room";
import { tagRouter } from "./routers/tag";
import { bookRouter } from "./routers/book";
import { bookThreadRouter } from "./routers/book-thread";
import { flowchartRouter } from "./routers/flowchart";
import { noteRouter } from "./routers/note";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  room: roomRouter,
  tag: tagRouter,
  book: bookRouter,
  bookThread: bookThreadRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
