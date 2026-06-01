import { useProfile } from "@/hooks/useProfile";
import { Flame, Award } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { PartnerStatusCard } from "@/components/dashboard/PartnerStatusCard";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import { workoutService } from "@/services/workout.service";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: stats } = useDashboardData(profile?.id);

  const { data: partnerProfile } = useQuery({
    queryKey: ['partner_profile', profile?.partner_id],
    queryFn: () => profile?.partner_id ? profileService.getPartnerProfile(profile.partner_id) : null,
    enabled: !!profile?.partner_id
  });

  const { data: workoutPlans } = useQuery({
    queryKey: ['workout_plans'],
    queryFn: () => workoutService.getWorkoutPlans()
  });

  const nextWorkout = workoutPlans?.[0];

  const weeklyProgress = [
    { name: 'Completed', value: stats?.weeklyCount || 0, fill: 'var(--color-accent)' },
    { name: 'Remaining', value: Math.max(0, (stats?.weeklyGoal || 5) - (stats?.weeklyCount || 0)), fill: '#E2E8F0' }
  ];

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
            <span className="text-xl font-bold text-primary">{(profile?.display_name || profile?.username || "U").charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-foreground">Olá, {profile?.display_name || profile?.username || "atleta"}!</h2>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame size={16} fill="currentColor" />
              <span className="text-sm font-bold">{stats?.streak || 0} dias seguidos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {nextWorkout ? (
          <TodayWorkoutCard 
            title={nextWorkout.name}
            exercisesCount={5} // This could also be dynamic if we query exercises
            duration="45 min"
            onStart={() => navigate(`/workout-execution/${nextWorkout.id}`)}
          />
        ) : (
          <div className="rounded-3xl bg-card p-6 shadow-lg border border-border flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">Nenhum treino disponível.</p>
            <button 
              onClick={() => navigate('/workouts')}
              className="text-primary font-bold hover:underline"
            >
              Criar Plano de Treino
            </button>
          </div>
        )}

        <PartnerStatusCard 
          name={partnerProfile?.display_name || "Parceiro"}
          trainedToday={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-card p-6 shadow-lg border border-border md:col-span-1">
          <h4 className="mb-2 font-bold text-foreground">Progresso Semanal</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={10} data={weeklyProgress}>
                <RadialBar dataKey="value" cornerRadius={5} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">{stats?.weeklyCount || 0} de {stats?.weeklyGoal || 5} treinos feitos</p>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-lg border border-border md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-bold text-foreground">Últimas Conquistas</h4>
            <Award className="text-accent" size={20} />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex min-w-[120px] flex-col items-center gap-2 rounded-2xl bg-muted p-4 border border-border">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                   <Award size={24} className="text-accent" />
                </div>
                <span className="text-center text-[10px] font-bold uppercase text-foreground">Badge {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

