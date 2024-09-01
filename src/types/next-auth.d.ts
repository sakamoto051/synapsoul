// src/types/next-auth.d.ts

import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      displayName?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    displayName?: string | null;
  }
}

// JWT Tokenを使用する場合は以下も追加
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    displayName?: string | null;
  }
}
