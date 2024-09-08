import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import useAuthStore from "~/store/useAuthStore";

export async function initializeAuthStore() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      displayName: session.user.displayName,
    });
  } else {
    useAuthStore.getState().logout();
  }
}
