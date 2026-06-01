import { motion } from "framer-motion";
import { Play, Dumbbell } from "lucide-react";

interface TodayWorkoutCardProps {
  title: string;
  exercisesCount: number;
  duration: string;
  onStart: () => void;
}

export function TodayWorkoutCard({ title, exercisesCount, duration, onStart }: TodayWorkoutCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-surface p-6 text-white shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">Treino de Hoje</span>
        <Dumbbell className="text-primary" />
      </div>
      <h3 className="mb-2 text-2xl font-bold font-display">{title}</h3>
      <p className="mb-6 text-white/60">{exercisesCount} exercícios • {duration} aprox.</p>
      <button 
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-bold text-white transition-all active:scale-95"
      >
        <Play size={20} fill="currentColor" />
        Iniciar Treino
      </button>
    </motion.div>
  );
}
