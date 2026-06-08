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

  async addMeasurement(measurement: Omit<Measurement, 'id' | 'user_id' | 'recorded_at'>): Promise<Measurement | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from('body_measurements')
      .insert({
        ...measurement,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding measurement:", error);
      throw error;
    }

    // Update last_measurement_date in profile
    await supabase
      .from('profiles')
      .update({ last_measurement_date: new Date().toISOString() })
      .eq('id', user.id);

    return data;
  }
};
