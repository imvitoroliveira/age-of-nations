import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { Flame, Award } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { PartnerStatusCard } from "@/components/dashboard/PartnerStatusCard";

export default function Dashboard() {
  const { data: profile } = useProfile();

  const weeklyProgress = [
    { name: 'Completed', value: 3, fill: 'var(--color-accent)' },
    { name: 'Remaining', value: 2, fill: '#E2E8F0' }
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
            <span className="text-xl font-bold text-primary">{(profile?.display_name || profile?.username || "U").charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display">Olá, {profile?.display_name || profile?.username || "atleta"}!</h2>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame size={16} fill="currentColor" />
              <span className="text-sm font-bold">5 dias seguidos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <TodayWorkoutCard 
          title="Peito & Tríceps"
          exercisesCount={5}
          duration="45 min"
          onStart={() => console.log("Starting workout...")}
        />

        <PartnerStatusCard 
          name="Maria"
          trainedToday={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-lg md:col-span-1">
          <h4 className="mb-2 font-bold">Progresso Semanal</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={10} data={weeklyProgress}>
                <RadialBar dataKey="value" cornerRadius={5} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm font-medium text-text-muted">3 de 5 treinos feitos</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-bold">Últimas Conquistas</h4>
            <Award className="text-accent" size={20} />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex min-w-[120px] flex-col items-center gap-2 rounded-2xl bg-bg p-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                   <Award size={24} className="text-accent" />
                </div>
                <span className="text-center text-[10px] font-bold uppercase">Badge {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
