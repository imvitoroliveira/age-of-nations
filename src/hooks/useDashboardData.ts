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
      const { data: weeklySessions, error: countError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('finished_at', start.toISOString())
        .lte('finished_at', end.toISOString());

      if (countError) throw countError;

      const weeklyCount = weeklySessions?.length || 0;

      // 1b. Total active time (duration_minutes sum)
      const { data: allSessions } = await supabase
        .from('workout_sessions')
        .select('duration_minutes')
        .eq('user_id', userId);
      
      const totalMinutes = allSessions?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0;
      const totalHours = (totalMinutes / 60).toFixed(1);


      // 2. Trained today?
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('workout_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('finished_at', today.toISOString());

      // 3. Current streak
      const { data: recentSessions } = await supabase
        .from('workout_sessions')
        .select('finished_at')
        .eq('user_id', userId)
        .order('finished_at', { ascending: false });

      let streak = 0;
      if (recentSessions && recentSessions.length > 0) {
        const uniqueDays = new Set(
          recentSessions
            .filter(s => s.finished_at)
            .map(s => format(new Date(s.finished_at!), 'yyyy-MM-dd'))
        );
        
        const sortedDays = Array.from(uniqueDays).sort((a, b) => b.localeCompare(a));
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const yesterdayStr = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
        
        if (sortedDays[0] === todayStr || sortedDays[0] === yesterdayStr) {
          let checkDate = new Date(sortedDays[0]);
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
        weeklyCount: weeklyCount,
        weeklyGoal: 5,
        streak: streak,
        trainedToday: (todayCount || 0) > 0,
        totalActiveTime: `${totalHours}h`,
        weeklySessionDays: weeklySessions?.map(s => new Date(s.finished_at!).getDay()) || []
      };
    },
    enabled: !!userId
  });
}
