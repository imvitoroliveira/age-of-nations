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

  async linkPartner(userId: string, pairingCode: string): Promise<void> {
    // Find the partner with the given pairing code
    const { data: partner, error: partnerError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('pairing_code', pairingCode)
      .single();

    if (partnerError || !partner) {
      throw new Error("Código de parceiro inválido.");
    }

    if (partner.id === userId) {
      throw new Error("Você não pode se vincular a si mesmo.");
    }

    // Update current user's partner_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ partner_id: partner.id })
      .eq('id', userId);

    if (updateError) {
      console.error("Error linking partner:", updateError);
      throw updateError;
    }

    // Reciprocally update partner's partner_id
    await supabase
      .from('profiles')
      .update({ partner_id: userId })
      .eq('id', partner.id);
  },

  async unlinkPartner(userId: string, partnerId: string): Promise<void> {
    // Unlink current user
    const { error: error1 } = await supabase
      .from('profiles')
      .update({ partner_id: null })
      .eq('id', userId);

    if (error1) throw error1;

    // Unlink partner
    await supabase
      .from('profiles')
      .update({ partner_id: null })
      .eq('id', partnerId);
  }
};

