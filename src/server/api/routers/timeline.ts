// src/server/api/routers/timeline.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const timelineRouter = createTRPCRouter({
  getAllByUserId: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db.timeline.findMany({
      where: {
        book: {
          userId: Number(userId),
        },
      },
      include: {
        book: true,
        characters: true,
        events: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const timeline = await ctx.db.timeline.findUnique({
        where: { id: input.id },
        include: {
          characters: true,
          events: true,
        },
      });

      if (!timeline) {
        throw new Error("Timeline not found");
      }

      return {
        ...timeline,
        events: timeline.events.map((event) => ({
          ...event,
          startTime: event.startTime.toISOString(),
          endTime: event.endTime.toISOString(),
        })),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        bookId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.create({
        data: {
          title: input.title,
          bookId: input.bookId,
        },
      });
    }),

  getByBookId: protectedProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.timeline.findMany({
        where: { bookId: input.bookId },
        include: {
          characters: true,
          events: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.update({
        where: { id: input.id },
        data: { title: input.title },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timeline.delete({
        where: { id: input.id },
      });
    }),

  addCharacter: protectedProcedure
    .input(
      z.object({
        timelineId: z.number(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          color: input.color,
          timelineId: input.timelineId,
        },
      });
    }),

  addEvent: protectedProcedure
    .input(
      z.object({
        timelineId: z.number(),
        characterId: z.number(),
        action: z.string(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.create({
        data: {
          action: input.action,
          startTime: input.startTime,
          endTime: input.endTime,
          characterId: input.characterId,
          timelineId: input.timelineId,
        },
      });
    }),

  saveTimeline: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        characters: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
          }),
        ),
        events: z.array(
          z.object({
            id: z.string(),
            characterId: z.string(),
            action: z.string(),
            startTime: z.string(),
            endTime: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, characters, events } = input;

      // トランザクションを使用してデータを一括で保存
      return ctx.db.$transaction(async (tx) => {
        // タイムラインの更新
        const updatedTimeline = await tx.timeline.update({
          where: { id },
          data: { title },
        });

        // 既存のキャラクターとイベントを削除
        await tx.character.deleteMany({ where: { timelineId: id } });
        await tx.event.deleteMany({ where: { timelineId: id } });

        // 新しいキャラクターを作成
        const createdCharacters = await Promise.all(
          characters.map((char) =>
            tx.character.create({
              data: {
                name: char.name,
                color: char.color,
                timelineId: id,
              },
            }),
          ),
        );

        // キャラクターIDのマッピングを作成
        const characterIdMap = characters.reduce(
          (acc, char, index) => {
            if (createdCharacters[index]) {
              acc[char.id] = createdCharacters[index].id;
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        // 新しいイベントを作成
        await Promise.all(
          events.map((event) =>
            tx.event.create({
              data: {
                action: event.action,
                startTime: new Date(event.startTime),
                endTime: new Date(event.endTime),
                characterId: characterIdMap[event.characterId] ?? 0, // Default to 0 or handle appropriately
                timelineId: id,
              },
            }),
          ),
        );

        return updatedTimeline;
      });
    }),

  // Add more procedures for updating and deleting characters and events as needed
});
