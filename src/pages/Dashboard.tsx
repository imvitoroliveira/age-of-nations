import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Flame, Dumbbell, Users, Award, Play } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    }
  });

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
        {/* Treino de Hoje Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="rounded-3xl bg-surface p-6 text-white shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">Treino de Hoje</span>
            <Dumbbell className="text-primary" />
          </div>
          <h3 className="mb-2 text-2xl font-bold font-display">Peito & Tríceps</h3>
          <p className="mb-6 text-white/60">5 exercícios • 45 min aprox.</p>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-bold text-white transition-all active:scale-95">
            <Play size={20} fill="currentColor" />
            Iniciar Treino
          </button>
        </motion.div>

        {/* Parceiro Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="rounded-3xl bg-white p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-bg p-2 text-primary">
              <Users size={20} />
            </span>
            <span className="text-xs font-bold text-text-muted uppercase">Status do Parceiro</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent">
              <span className="text-xl font-bold text-accent">M</span>
            </div>
            <div>
              <h3 className="text-lg font-bold">Maria</h3>
              <p className="text-sm text-green-500 font-medium">Treinou hoje! ✅</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Progresso Semanal */}
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

        {/* Últimas Conquistas */}
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
