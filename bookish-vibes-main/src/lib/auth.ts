import { supabase } from "./supabase";

export type UserRole = "member" | "admin";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  membershipType: "basic" | "premium" | "vip";
  isGuest?: boolean;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  adminCode?: string
) {
  if (role === "admin") {
    const expectedCode = import.meta.env.VITE_ADMIN_SECRET_CODE || "LIBRAVAULT_ADMIN";
    if (adminCode !== expectedCode) {
      throw new Error("Invalid admin code. Please contact your system administrator.");
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    role: data.role as UserRole,
    avatarUrl: data.avatar_url,
    membershipType: data.membership_type || "basic",
  };
}
