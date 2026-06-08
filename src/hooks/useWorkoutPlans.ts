import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useWorkoutPlans() {
  return useQuery({
    queryKey: ['workout_plans'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('partner_id')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('workout_plans')
        .select('*, exercises(*)')
        .or(`assigned_to.eq.${user.id}${profile?.partner_id ? `,assigned_to.eq.${profile.partner_id}` : ''}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching workout plans:", error);
        return [];
      }

      return data || [];
    }
  });
}
