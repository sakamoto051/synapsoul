import { useSession } from "next-auth/react";
import useAuthStore from "~/store/useAuthStore";

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated } = useAuthStore();

  // セッションとストアの状態を組み合わせて、最新の認証状態を返す
  return {
    user: user ?? session?.user,
    isAuthenticated: isAuthenticated || status === "authenticated",
    isLoading: status === "loading",
  };
}
