import { useProfile } from "@/hooks/useProfile";
import { Flame, Award, ArrowUpRight, Trophy, Zap, Clock, Plus } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { PartnerStatusCard } from "@/components/dashboard/PartnerStatusCard";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import { workoutService } from "@/services/workout.service";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: stats, isLoading: isStatsLoading } = useDashboardData(profile?.id ?? undefined);
  const { data: partnerStats, isLoading: isPartnerStatsLoading } = useDashboardData(profile?.partner_id ?? undefined);

  const { data: partnerProfile, isLoading: isPartnerProfileLoading } = useQuery({
    queryKey: ['partner_profile', profile?.partner_id],
    queryFn: () => profile?.partner_id ? profileService.getPartnerProfile(profile.partner_id) : null,
    enabled: !!profile?.partner_id
  });

  const { data: workoutPlans, isLoading: isWorkoutPlansLoading } = useQuery({
    queryKey: ['workout_plans'],
    queryFn: () => workoutService.getWorkoutPlans()
  });

  const isDataLoading = isProfileLoading || isStatsLoading || isWorkoutPlansLoading;

  const nextWorkout = workoutPlans?.[0];

  const weeklyProgress = [
    { 
      name: 'Completed', 
      value: stats?.weeklyCount || 0, 
      fill: 'var(--color-primary)' 
    },
    { 
      name: 'Remaining', 
      value: Math.max(0, (stats?.weeklyGoal || 5) - (stats?.weeklyCount || 0)), 
      fill: 'rgba(99, 102, 241, 0.1)' 
    }
  ];

  if (isDataLoading) {
    return (
      <div className="space-y-10 pb-28 md:pb-12 animate-pulse">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-28 md:pb-12"
    >
      <motion.header variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm overflow-hidden group">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
               ) : (
                 <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{(profile?.display_name || profile?.username || "U").charAt(0)}</span>
               )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-orange-500 border-4 border-background flex items-center justify-center">
              <Flame size={12} className="text-white" fill="currentColor" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Olá, <span className="text-indigo-600 dark:text-indigo-400">{profile?.display_name || profile?.username || "atleta"}</span>!
            </h2>
            <p className="text-slate-500 font-medium mt-0.5">Sua meta semanal está {Math.round(((stats?.weeklyCount || 0) / (stats?.weeklyGoal || 5)) * 100)}% concluída.</p>
          </div>
        </div>
        <button 
          aria-label="Ativar reforço"
          className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Zap size={20} className="text-indigo-600" />
        </button>
      </motion.header>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.2rem] opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200 blur"></div>
            {nextWorkout ? (
              <TodayWorkoutCard 
                title={nextWorkout.name}
                exercisesCount={5}
                duration="45 min"
                onStart={() => navigate(`/workout-execution/${nextWorkout.id}`)}
              />
            ) : (
              <div className="card-premium h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sem treinos para hoje</h3>
                <p className="text-slate-500 max-w-[200px] mx-auto mb-6 font-medium">Que tal planejar sua próxima sessão?</p>
                <button 
                  onClick={() => navigate('/workouts')}
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all hover:scale-[1.02]"
                >
                  Criar Plano
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="card-premium flex flex-col justify-between group">
                <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 mb-4 transition-transform group-hover:scale-110">
                  <Flame size={24} fill="currentColor" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.streak || 0}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3">Dias de Fogo</div>
                </div>
             </div>
             <div className="card-premium flex flex-col justify-between group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-4 transition-transform group-hover:scale-110">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.totalActiveTime || "0h"}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3">Total Ativo</div>
                </div>
             </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-8">
          {isPartnerProfileLoading || isPartnerStatsLoading ? (
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />
          ) : (
            <PartnerStatusCard 
              name={partnerProfile?.display_name || "Parceiro"}
              trainedToday={partnerStats?.trainedToday || false}
            />
          )}
          
          <div className="card-premium overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Status Semanal</h4>
              <ArrowUpRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
            </div>
            <div className="relative h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={weeklyProgress} startAngle={90} endAngle={450}>
                  <RadialBar dataKey="value" cornerRadius={6} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.weeklyCount || 0}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Treinos</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
                const isCompleted = stats?.weeklySessionDays?.includes(day);
                return (
                  <span key={day} className={isCompleted ? "text-indigo-600 dark:text-indigo-400" : ""}>
                    {days[day]}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="card-premium">
        <div className="mb-8 flex items-center justify-between">
          <h4 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-3 font-display tracking-tight">
            <Trophy className="text-orange-400" size={24} />
            Conquistas de Elite
          </h4>
          <button 
            onClick={() => navigate('/achievements')} 
            className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            Ver todas
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex min-w-[140px] flex-col items-center gap-4 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                   <Award size={32} className="text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                {i === 1 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <Zap size={10} className="text-white" fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">Primeiro Passo</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Completado</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
