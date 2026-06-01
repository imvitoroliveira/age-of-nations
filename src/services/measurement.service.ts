import { supabase } from "@/lib/supabase";
import { Database } from "@/integrations/supabase/types";

export type Measurement = Database['public']['Tables']['body_measurements']['Row'];

export const measurementService = {
  async getMeasurements(): Promise<Measurement[]> {
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .order('recorded_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching measurements:", error);
      return [];
    }
    
    return data || [];
  }
};
