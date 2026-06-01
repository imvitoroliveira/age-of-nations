import { supabase } from "@/lib/supabase";
import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    return data;
  },

  async getPartnerProfile(partnerId: string): Promise<Profile | null> {
    if (!partnerId) return null;
    return this.getProfile(partnerId);
  }
};
