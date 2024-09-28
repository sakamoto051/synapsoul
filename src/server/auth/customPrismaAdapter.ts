import { PrismaAdapter } from "@auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import type { AdapterUser } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient) {
  return {
    ...PrismaAdapter(prisma),
    createUser: async (user: Omit<AdapterUser, "id">) => {
      const session = await getServerSession(authOptions);
      const currentUserId = session?.user?.id ? Number(session.user.id) : null;

      const currentUser = currentUserId
        ? await prisma.user.findUnique({
            where: { id: currentUserId },
          })
        : null;

      if (currentUser) {
        // 既存のユーザーを更新
        return await prisma.user.update({
          where: { id: currentUser.id },
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
            displayName: user.name,
          },
        });
      }
      // 新規ユーザーを作成
      return await prisma.user.create({
        data: {
          ...user,
          email: user.email ?? "", // emailはnullableではないので空文字列を設定
        },
      });
    },
  };
}
