import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "BUYER" | "FARMER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  hasHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      logout: () => {
        set({ user: null });
      },

      isAuthenticated: () => {
        return get().user !== null;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
