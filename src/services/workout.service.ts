import { supabase } from "@/lib/supabase";
import { Database } from "@/integrations/supabase/types";

export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];

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
  },

  async createWorkoutPlan(
    name: string, 
    description: string, 
    assignedTo: string, 
    exercises: Omit<Exercise, 'id' | 'created_at' | 'workout_plan_id'>[],
    videoUrl?: string
  ) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Não autenticado");

    // 1. Create the plan
    const { data: plan, error: planError } = await supabase
      .from('workout_plans')
      .insert({
        name,
        description,
        created_by: userData.user.id,
        assigned_to: assignedTo,
        video_url: videoUrl,
      })
      .select()
      .single();

    if (planError) throw planError;

    // 2. Create the exercises
    if (exercises.length > 0) {
      const exercisesWithPlanId = exercises.map((ex, index) => ({
        ...ex,
        workout_plan_id: plan.id,
        order_index: index
      }));

      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesWithPlanId);

      if (exercisesError) throw exercisesError;
    }

    return plan;
  }
};
