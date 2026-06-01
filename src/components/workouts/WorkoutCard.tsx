import { motion } from "framer-motion";
import { User, Users, ChevronRight } from "lucide-react";
import { WorkoutPlan } from "@/services/workout.service";

interface WorkoutCardProps {
  plan: WorkoutPlan;
}

export function WorkoutCard({ plan }: WorkoutCardProps) {
  return (
    <motion.div
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
          {plan.created_by === plan.assigned_to ? (
            <User size={16} className="text-text-muted" />
          ) : (
            <Users size={16} className="text-primary" />
          )}
        </div>
        <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{plan.name}</h3>
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
  );
}
