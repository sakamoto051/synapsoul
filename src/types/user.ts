// src/types/user.ts
import type {
  User as PrismaUser,
  Account as PrismaAccount,
  Session as PrismaSession,
} from "@prisma/client";

export type User = PrismaUser;
export type Account = PrismaAccount;
export type Session = PrismaSession;
