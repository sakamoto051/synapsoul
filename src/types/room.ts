// src/types/room.ts
import type {
  Room as PrismaRoom,
  Chat as PrismaChat,
  Tag as PrismaTag,
} from "@prisma/client";

export type Room = PrismaRoom;
export type Chat = PrismaChat;
export type Tag = PrismaTag;
