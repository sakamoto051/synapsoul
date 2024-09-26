"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useAuthStore from "~/store/useAuthStore";

export function AuthStateManager() {
  const { data: session, status } = useSession();
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        displayName: session.user.displayName,
      });
    } else if (status === "unauthenticated") {
      logout();
    }
  }, [session, status, setUser, logout]);

  return null; // このコンポーネントは何もレンダリングしません
}
