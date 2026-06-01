import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Award, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Achievements() {
  const { data: allAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data } = await supabase.from('achievements').select('*');
      return data || [];
    }
  });

  const { data: unlocked } = useQuery({
    queryKey: ['user_achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('user_achievements').select('achievement_id').eq('user_profile_id', user?.id);
      return data?.map(a => a.achievement_id) || [];
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-display">Minhas Conquistas</h2>
        <p className="text-text-muted">Celebre cada marco da sua jornada.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {allAchievements?.map((achievement, index) => {
          const isUnlocked = unlocked?.includes(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative flex flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-lg transition-all",
                !isUnlocked && "opacity-40 grayscale"
              )}
            >
              <div className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border-4",
                isUnlocked ? "border-accent bg-accent/10 text-accent" : "border-bg bg-bg text-text-muted"
              )}>
                <Award size={32} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold">{achievement.title}</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-tight">{achievement.description}</p>
              </div>
              {isUnlocked ? (
                <div className="absolute -right-1 -top-1 rounded-full bg-accent p-1 text-white shadow-md">
                  <CheckCircle2 size={14} />
                </div>
              ) : (
                <div className="absolute -right-1 -top-1 rounded-full bg-bg p-1 text-text-muted shadow-md">
                  <Lock size={14} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
