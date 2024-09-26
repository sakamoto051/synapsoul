import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      displayName: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    displayName?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.displayName = user.displayName;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.displayName = token.displayName ?? null;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile: (profile: {
        sub: string;
        name: string;
        email: string;
        picture: string;
      }) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          displayName: profile.name,
        };
      },
    }),
    CredentialsProvider({
      name: "Guest",
      credentials: {},
      async authorize() {
        const user = await db.user.create({
          data: {
            name: `Guest_${Math.random().toString(36).substr(2, 9)}`,
            displayName: "Guest",
          },
        });
        return {
          ...user,
          id: user.id.toString(), // Ensure id is a string
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // Remove the custom pages configuration
  // pages: {
  //   signIn: "/auth/signin",
  // },
};

export const getServerAuthSession = () => getServerSession(authOptions);
