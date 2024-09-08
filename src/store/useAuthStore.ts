import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  displayName?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
    },
  ),
);

export default useAuthStore;
