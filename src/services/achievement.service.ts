import { supabase } from "@/lib/supabase";
import { Database } from "@/integrations/supabase/types";

export type Achievement = Database['public']['Tables']['achievements']['Row'];

export const achievementService = {
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
    return data || [];
  },

  async getUnlockedAchievements(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching user achievements:", error);
      return [];
    }
    
    return data?.map(a => a.achievement_id) || [];
  }
};
