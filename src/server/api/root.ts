import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "./routers/room";
import { tagRouter } from "./routers/tag";
import { bookRouter } from "./routers/book";
import { bookThreadRouter } from "./routers/book-thread";
import { noteRouter } from "./routers/note";
import { userRouter } from "./routers/user";
import { feedbackRouter } from "./routers/feedback";
import { bookAPIRouter } from "./routers/bookAPI";
import { timelineRouter } from "./routers/timeline";
import { characterRouter } from "./routers/character";
import { eventRouter } from "./routers/event";
import { timelineGroupRouter } from "./routers/timelineGroup";

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
  bookAPI: bookAPIRouter,
  bookThread: bookThreadRouter,
  note: noteRouter,
  user: userRouter,
  feedback: feedbackRouter,
  timelineGroup: timelineGroupRouter,
  timeline: timelineRouter,
  character: characterRouter,
  event: eventRouter,
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
