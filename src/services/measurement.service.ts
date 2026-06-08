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
  },

  async addMeasurement(measurement: Partial<Omit<Measurement, 'id' | 'user_id' | 'recorded_at'>>): Promise<void> {
    const { error } = await supabase.rpc('add_body_measurement' as any, {
      weight_kg_param: measurement.weight_kg ?? 0,
      waist_cm_param: measurement.waist_cm ?? null,
      thigh_cm_param: measurement.thigh_cm ?? null,
      hip_cm_param: measurement.hip_cm ?? null,
    });

    if (error) {
      console.error("Error adding measurement via RPC:", error);
      throw error;
    }
  }
};
