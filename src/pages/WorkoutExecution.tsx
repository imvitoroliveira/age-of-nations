import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, Check, Timer, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { workoutSessionService } from "@/services/workoutSession.service";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export default function WorkoutExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan', id],
    queryFn: async () => {
      if (!id) return null;
      const { data: planData } = await supabase.from('workout_plans').select('*').eq('id', id).single();
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_plan_id', id)
        .order('order_index', { ascending: true });
      return { ...planData, exercises: exercises || [] };
    },
    enabled: !!id,
  });

  const exercises = plan?.exercises || [];
  const currentExercise = exercises[currentIdx];

  useEffect(() => {
    if (currentExercise) {
      setCompletedSets(new Array(currentExercise.sets).fill(false));
    }
  }, [currentIdx, currentExercise]);

  const handleFinish = async () => {
    const duration = Math.floor((Date.now() - startTime) / 60000);
    
    try {
      const user = await authService.getCurrentUser();
      if (!user || !id) return;
      
      await workoutSessionService.finishWorkout(user.id, id, duration);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#85BAEA', '#E2EB88', '#99251F']
      });

      toast.success("Treino finalizado com sucesso!");
      navigate('/');
    } catch (error: any) {
      toast.error("Erro ao finalizar treino: " + error.message);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-bg-dark text-white">Iniciando...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-bg-dark text-white">
      <header className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="rounded-full bg-white/10 p-2 text-white">
          <X size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{plan?.name}</p>
          <h2 className="text-sm font-bold">{currentIdx + 1} de {exercises.length} exercícios</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-primary">
          <Timer size={16} />
          <span className="text-sm font-bold">{formatTime(elapsedSeconds)}</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-1 flex-col"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-display">{currentExercise?.name}</h1>
              <p className="mt-2 text-white/60">{currentExercise?.notes || "Mantenha a postura e respiração controlada."}</p>
            </div>

            <div className="space-y-4">
              {completedSets.map((done, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const newSets = [...completedSets];
                    newSets[idx] = !newSets[idx];
                    setCompletedSets(newSets);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl p-6 transition-all",
                    done ? "bg-primary text-white" : "bg-white/5 text-white/40"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">Série {idx + 1}</span>
                    <span className="text-sm">{currentExercise?.reps} reps • {currentExercise?.weight_kg || 0}kg</span>
                  </div>
                  {done ? <Check size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-white/20" />}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="grid grid-cols-2 gap-4 p-6 bg-surface/50 backdrop-blur-md">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 p-4 font-bold disabled:opacity-30"
        >
          <ChevronLeft size={20} />
          Anterior
        </button>
        
        {currentIdx === exercises.length - 1 ? (
          <button
            onClick={handleFinish}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-bold text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            <Check size={20} />
            Finalizar
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-bold"
          >
            Próximo
            <ChevronRight size={20} />
          </button>
        )}
      </footer>
    </div>
  );
}
