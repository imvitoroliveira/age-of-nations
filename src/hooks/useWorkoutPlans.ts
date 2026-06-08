import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useWorkoutPlans() {
  return useQuery({
    queryKey: ['workout_plans'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // We only want to see plans assigned to the current user
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*, exercises(*)')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching workout plans:", error);
        return [];
      }

      return data || [];
    }
  });
}
