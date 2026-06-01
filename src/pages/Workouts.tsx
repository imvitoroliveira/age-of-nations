import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, Dumbbell, User, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Workouts() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['workout_plans'],
    queryFn: async () => {
      const { data } = await supabase
        .from('workout_plans')
        .select('*');
      return data || [];
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display">Meus Treinos</h2>
          <p className="text-text-muted">Gerencie seus planos e os do seu parceiro.</p>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse rounded-3xl bg-white" />)
        ) : (
          plans?.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                      Treino
                    </span>
                  </div>
                  {plan.creator_profile_id === plan.user_profile_id ? (
                    <User size={16} className="text-text-muted" />
                  ) : (
                    <Users size={16} className="text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{plan.title}</h3>
                <p className="text-sm text-text-muted line-clamp-2 mt-1">{plan.description}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">5 exercícios</span>
                <button className="flex items-center gap-1 text-sm font-bold text-primary">
                  Ver Detalhes
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {!isLoading && plans?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-bg">
            <Dumbbell size={40} className="text-text-muted/30" />
          </div>
          <h3 className="text-lg font-bold">Nenhum plano encontrado</h3>
          <p className="text-text-muted">Comece criando seu primeiro plano de treino!</p>
        </div>
      )}
    </div>
  );
}
