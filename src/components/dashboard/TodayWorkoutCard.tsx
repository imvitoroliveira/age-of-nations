import { motion } from "framer-motion";
import { Play, Dumbbell, Zap } from "lucide-react";

interface TodayWorkoutCardProps {
  title: string;
  exercisesCount: number;
  duration: string;
  onStart: () => void;
}

export function TodayWorkoutCard({ title, exercisesCount, duration, onStart }: TodayWorkoutCardProps) {
  return (
    <motion.div 
      className="card-premium relative overflow-hidden group bg-slate-950 text-white border-0"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Dumbbell size={120} className="rotate-12" />
      </div>
      
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Workout of the Day</span>
          </div>
          <Zap className="text-white/20" size={20} />
        </div>
        
        <h3 className="mb-2 text-4xl font-bold font-display tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-500">{title}</h3>
        <p className="mb-10 text-slate-400 font-medium">{exercisesCount} exercícios • {duration} aprox.</p>
        
        <button 
          onClick={onStart}
          className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 shadow-xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-95 hover:shadow-white/10"
        >
          <Play size={18} fill="currentColor" />
          <span className="tracking-tight">Iniciar Sessão</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-1000" />
    </motion.div>
  );
}
