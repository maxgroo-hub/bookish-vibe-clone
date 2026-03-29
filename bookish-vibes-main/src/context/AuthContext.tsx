import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getProfile, AppUser } from "@/lib/auth";
import { useAuthStore } from "@/store";

interface AuthContextValue {
  session: Session | null;
  supabaseUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  supabaseUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const syncProfile = useCallback(async (user: User | null) => {
    if (!user) {
      logout();
      setSupabaseUser(null);
      return;
    }
    setSupabaseUser(user);

    const profile = await getProfile(user.id);
    if (profile) {
      setUser(profile);
    } else {
      const meta = user.user_metadata;
      const fallbackUser: AppUser = {
        id: user.id,
        fullName: meta?.full_name || meta?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        role: (meta?.role as "member" | "admin") || "member",
        avatarUrl: meta?.avatar_url || meta?.picture,
        membershipType: "basic",
      };
      setUser(fallbackUser);
    }
  }, [setUser, logout]);

  useEffect(() => {
    let didSetLoading = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      syncProfile(session?.user ?? null).finally(() => {
        if (!didSetLoading) {
          didSetLoading = true;
          setLoading(false);
        }
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      syncProfile(session?.user ?? null).finally(() => {
        if (!didSetLoading) {
          didSetLoading = true;
          setLoading(false);
        }
      });
    });

    return () => subscription.unsubscribe();
  }, [syncProfile]);

  return (
    <AuthContext.Provider value={{ session, supabaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
