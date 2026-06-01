import { useQuery } from "@tanstack/react-query";
import { achievementService } from "@/services/achievement.service";
import { authService } from "@/services/auth.service";

export function useAchievements() {
  const allAchievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementService.getAllAchievements()
  });

  const unlockedAchievementsQuery = useQuery({
    queryKey: ['user_achievements'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (!user) return [];
      return achievementService.getUnlockedAchievements(user.id);
    }
  });

  return {
    allAchievements: allAchievementsQuery.data || [],
    unlocked: unlockedAchievementsQuery.data || [],
    isLoading: allAchievementsQuery.isLoading || unlockedAchievementsQuery.isLoading
  };
}
