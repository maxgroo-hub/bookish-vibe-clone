import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser } from "@/lib/auth";

export type { AppUser };

interface AuthStore {
  user: AppUser | null;
  isAuthenticated: boolean;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
  loginAsGuest: (role: "member" | "admin") => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        const user = get().user;
        if (user && !user.isGuest) {
          import("@/lib/supabase").then(({ supabase }) => {
            supabase.auth.signOut();
          });
        }
        set({ user: null, isAuthenticated: false });
      },
      loginAsGuest: (role) => set({
        user: {
          id: `guest-${role}`,
          fullName: role === "admin" ? "Guest Admin" : "Guest User",
          email: `guest@${role}.com`,
          role,
          membershipType: role === "admin" ? "vip" : "basic",
          isGuest: true,
        },
        isAuthenticated: true,
      }),
    }),
    {
      name: "auth-storage",
    }
  )
);

interface UIStore {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
