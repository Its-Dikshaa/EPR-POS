import { createClient } from "@/lib/supabase/client";

export async function signUpWithSupabase(email: string, pass: string, name: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: name,
        role: "CASHIER",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithSupabase(email: string, pass: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) throw error;
  return data;
}

export async function signOutSupabase() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSupabaseUserSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}
