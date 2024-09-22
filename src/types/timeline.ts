// src/types/timeline.ts
import type {
  Timeline as PrismaTimeline,
  Character as PrismaCharacter,
  Event as PrismaEvent,
} from "@prisma/client";

export type Timeline = PrismaTimeline;
export type Character = PrismaCharacter;
export type Event = PrismaEvent;

export type CharacterWithVisibility = Character & { isVisible: boolean };
export type TimelineData = Timeline & {
  characters: CharacterWithVisibility[];
  events: Event[];
};
