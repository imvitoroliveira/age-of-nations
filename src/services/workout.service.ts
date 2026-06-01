import { supabase } from "@/lib/supabase";
import { Database } from "@/integrations/supabase/types";

export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];

export const workoutService = {
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching workout plans:", error);
      return [];
    }
    
    return data || [];
  }
};
