import { supabase } from "@/lib/supabase";
import { Database } from "@/integrations/supabase/types";

export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'] & {
  exercises?: Database['public']['Tables']['exercises']['Row'][];
};
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type ExerciseLibrary = any; // Will be Database['public']['Tables']['exercise_library']['Row']


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
  },

  async getExerciseLibrary(): Promise<ExerciseLibrary[]> {
    const { data, error } = await supabase
      .from('exercise_library' as any)
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching exercise library:", error);
      return [];
    }
    
    return data || [];
  },

  async addToExerciseLibrary(name: string, description: string, videoUrl: string) {
    const { data, error } = await supabase
      .from('exercise_library' as any)
      .insert({ name, description, video_url: videoUrl } as any)
      .select()
      .single();


    if (error) throw error;
    return data;
  },

  async uploadExerciseVideo(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('exercise-videos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Since the bucket is private, we store the file path and will generate a signed URL when needed
    // or we can try to return the path and handle it in the component.
    // For simplicity, let's return the path and have a helper to get the signed URL.
    return filePath;
  },

  async getExerciseVideoUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('exercise-videos')
      .createSignedUrl(path, 3600); // 1 hour expiration

    if (error) throw error;
    return data.signedUrl;
  }

};
