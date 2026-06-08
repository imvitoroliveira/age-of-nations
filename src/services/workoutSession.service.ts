import { supabase } from "@/lib/supabase";

export const workoutSessionService = {
  async startWorkout(_planId: string) {
    // Current code doesn't have an explicit 'start' in DB, it just tracks duration at finish
  },

  async finishWorkout(userId: string, planId: string, durationMinutes: number) {
    const { data, error } = await supabase.from('workout_sessions').insert({
      user_id: userId,
      workout_plan_id: planId,
      duration_minutes: durationMinutes,
      finished_at: new Date().toISOString(),
    });

    if (error) throw error;
    return data;
  },

  async getSessions(userId: string) {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('finished_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
