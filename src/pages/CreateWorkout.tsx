import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { workoutService, ExerciseLibrary } from "@/services/workout.service";
import { ChevronLeft, Plus, Trash2, Save, Dumbbell, User, Users, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateWorkout() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [assignedTo, setAssignedTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exerciseLibrary, setExerciseLibrary] = useState<ExerciseLibrary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);

  const [exercises, setExercises] = useState([
    { name: "", sets: 3, reps: "12", weight_kg: 0, notes: "", video_url: "" }
  ]);

  useEffect(() => {
    if (profile && !assignedTo) {
      setAssignedTo(profile.id);
    }
  }, [profile, assignedTo]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await workoutService.getExerciseLibrary();
        setExerciseLibrary(data);
      } catch (error) {
        console.error("Erro ao carregar biblioteca:", error);
      }
    };
    fetchLibrary();
  }, []);

  const selectFromLibrary = (exercise: ExerciseLibrary) => {
    if (activeExerciseIndex !== null) {
      updateExercise(activeExerciseIndex, 'name', exercise.name);
      if (exercise.video_url) {
        updateExercise(activeExerciseIndex, 'video_url', exercise.video_url);
      }
      setActiveExerciseIndex(null);
      setSearchTerm("");
    }
  };

  const filteredLibrary = exerciseLibrary.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: "12", weight_kg: 0, notes: "", video_url: "" }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) return;
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: any) => {
    setExercises(prev => {
      const newExercises = [...prev];
      newExercises[index] = { ...newExercises[index], [field]: value };
      return newExercises;
    });
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("O treino precisa de um nome.");
      return;
    }

    if (exercises.some(ex => !ex.name || !ex.name.trim())) {
      toast.error("Todos os exercícios precisam ter um nome selecionado.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedExercises = exercises.map(ex => ({
        name: ex.name,
        sets: Number(ex.sets) || 0,
        reps: String(ex.reps || ""),
        weight_kg: Number(ex.weight_kg) || 0,
        notes: ex.notes || "",
        video_url: ex.video_url || "",
        order_index: 0, // Will be set by service
        rest_seconds: 60 // Default rest
      }));

      await workoutService.createWorkoutPlan(name, description, assignedTo, formattedExercises, videoUrl);
      toast.success("Plano de treino criado!");
      navigate('/workouts');
    } catch (error: any) {
      toast.error("Erro ao criar plano: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-28 md:pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Novo Treino</h2>
      </div>

      <div className="card-premium space-y-8">
        <section className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Informações Básicas</label>
          <input 
            type="text"
            placeholder="Nome do Treino (ex: Superiores A)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all"
          />
          <textarea 
            placeholder="Breve descrição ou objetivo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all resize-none"
            rows={2}
          />
        </section>

        <section className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Para quem é este treino?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAssignedTo(profile?.id || "")}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-[1.8rem] border-2 transition-all",
                assignedTo === profile?.id 
                  ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400" 
                  : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400"
              )}
            >
              <User size={24} />
              <span className="font-bold text-sm">Para Mim</span>
            </button>
            
            <button
              disabled={!profile?.partner_id}
              onClick={() => profile?.partner_id && setAssignedTo(profile.partner_id)}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-[1.8rem] border-2 transition-all",
                assignedTo === profile?.partner_id 
                  ? "bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-600 dark:text-rose-400" 
                  : "bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400",
                !profile?.partner_id && "opacity-50 cursor-not-allowed"
              )}
            >
              <Users size={24} />
              <span className="font-bold text-sm">Para o Parceiro</span>
              {!profile?.partner_id && <span className="text-[10px] uppercase font-black">Nenhum parceiro vinculado</span>}
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Exercícios</label>
            <span className="text-xs font-bold text-indigo-500">{exercises.length} total</span>
          </div>

          <div className="space-y-4">
            {exercises.map((ex, index) => (
              <motion.div 
                layout
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                      <Dumbbell size={18} />
                    </div>
                    <div className="flex-1 relative">
                      <input 
                        type="text"
                        placeholder="Nome do exercício"
                        value={ex.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        className="w-full rounded-xl bg-white dark:bg-slate-800 p-3 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveExerciseIndex(index);
                        setSearchTerm("");
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-100 dark:border-indigo-500/20 whitespace-nowrap"
                    >
                      <Search size={14} />
                      Adicionar da biblioteca
                    </button>
                    
                    <button 
                      onClick={() => removeExercise(index)}
                      className="p-3 text-slate-300 hover:text-rose-500 transition-colors bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="relative">
                    
                    <AnimatePresence>
                      {activeExerciseIndex === index && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800"
                          >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Escolher Exercício</h3>
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                  autoFocus
                                  type="text"
                                  placeholder="Buscar exercício na biblioteca..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 text-sm font-bold outline-none border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                />
                              </div>
                            </div>
                            
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                              {filteredLibrary.length > 0 ? (
                                <div className="grid gap-2">
                                  {filteredLibrary.map((libEx) => (
                                    <button
                                      key={libEx.id}
                                      onClick={() => selectFromLibrary(libEx)}
                                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50"
                                    >
                                      <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500 shrink-0">
                                        <Dumbbell size={20} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 dark:text-white truncate">{libEx.name}</div>
                                        <div className="text-xs text-slate-400 line-clamp-1">{libEx.description}</div>
                                      </div>
                                      <ChevronRight size={16} className="text-slate-300" />
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-12 text-center">
                                  <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <Search size={24} />
                                  </div>
                                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhum exercício encontrado</p>
                                  <button 
                                    onClick={() => navigate('/admin-exercises')}
                                    className="mt-4 text-sm font-black text-indigo-500 hover:text-indigo-600 transition-colors"
                                  >
                                    + CADASTRAR NOVO NA BIBLIOTECA
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => setActiveExerciseIndex(null)}
                              className="w-full p-6 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white border-t border-slate-100 dark:border-slate-800 transition-colors bg-slate-50/50 dark:bg-slate-900/50"
                            >
                              Cancelar
                            </button>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Séries</label>
                    <input 
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      className="w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-center font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Reps/Tempo</label>
                    <input 
                      type="text"
                      value={ex.reps}
                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-center font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Peso (kg)</label>
                    <input 
                      type="number"
                      value={ex.weight_kg}
                      onChange={(e) => updateExercise(index, 'weight_kg', parseFloat(e.target.value))}
                      className="w-full rounded-xl bg-white dark:bg-slate-800 p-3 text-center font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700"
                    />
                  </div>
                </div>

                {ex.video_url && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Vídeo de execução vinculado
                    </span>
                  </div>
                )}
              </motion.div>
            ))}

            <button 
              onClick={addExercise}
              className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all font-bold text-sm"
            >
              <Plus size={18} />
              Adicionar Exercício
            </button>
          </div>
        </section>

        <button 
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : (
            <>
              <Save size={20} />
              Salvar Plano de Treino
            </>
          )}
        </button>
      </div>
    </div>
  );
}
