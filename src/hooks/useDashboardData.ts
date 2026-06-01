import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfWeek, endOfWeek, format } from "date-fns";

export function useDashboardData(userId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard_stats', userId],
    queryFn: async () => {
      if (!userId) return null;

      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(now, { weekStartsOn: 1 });

      // 1. Weekly workout count
      const { count: weeklyCount, error: countError } = await supabase
        .from('workout_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('finished_at', start.toISOString())
        .lte('finished_at', end.toISOString());

      if (countError) throw countError;

      // 2. Current streak (mocked for now as we don't have a daily log table, but we can derive from sessions)
      const { data: recentSessions } = await supabase
        .from('workout_sessions')
        .select('finished_at')
        .eq('user_id', userId)
        .order('finished_at', { ascending: false })
        .limit(10);

      // Simple streak logic: count consecutive days with a workout
      let streak = 0;
      if (recentSessions && recentSessions.length > 0) {
        const uniqueDays = new Set(
          recentSessions
            .filter(s => s.finished_at)
            .map(s => format(new Date(s.finished_at!), 'yyyy-MM-dd'))
        );
        
        const sortedDays = Array.from(uniqueDays).sort((a, b) => b.localeCompare(a));
        
        const todayStr = format(now, 'yyyy-MM-dd');
        const yesterdayStr = format(new Date(now.getTime() - 86400000), 'yyyy-MM-dd');
        
        let checkDate = sortedDays[0] === todayStr ? now : (sortedDays[0] === yesterdayStr ? new Date(now.getTime() - 86400000) : null);
        
        if (checkDate) {
          for (let i = 0; i < sortedDays.length; i++) {
            const expected = format(new Date(checkDate.getTime() - i * 86400000), 'yyyy-MM-dd');
            if (sortedDays[i] === expected) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      return {
        weeklyCount: weeklyCount || 0,
        weeklyGoal: 5, // Default goal
        streak: streak
      };
    },
    enabled: !!userId
  });
}
