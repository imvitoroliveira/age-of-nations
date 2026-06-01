import { supabase } from "@/lib/supabase";

export const authService = {
  async getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
