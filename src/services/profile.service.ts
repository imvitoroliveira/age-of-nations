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
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return data;
  },

  async linkPartner(_userId: string, pairingCode: string): Promise<void> {
    const { error } = await supabase.rpc('link_partner', { pairing_code: pairingCode });

    if (error) {
      console.error("Error linking partner:", error);
      throw new Error(error.message || "Erro ao vincular parceiro.");
    }
  },

  async unlinkPartner(userId: string, partnerId: string): Promise<void> {
    const { error } = await supabase.rpc('unlink_partner', { partner_id_param: partnerId });

    if (error) {
      console.error("Error unlinking partner:", error);
      throw new Error(error.message || "Erro ao desvincular parceiro.");
    }
  }
};

