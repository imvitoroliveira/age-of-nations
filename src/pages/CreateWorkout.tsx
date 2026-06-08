import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { workoutService, ExerciseLibrary } from "@/services/workout.service";
import { ChevronLeft, Plus, Trash2, Save, Dumbbell, User, Users, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateWorkout() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
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
    const newExercises = [...exercises];
    (newExercises[index] as any)[field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("O treino precisa de um nome.");
      return;
    }

    if (exercises.some(ex => !ex.name.trim())) {
      toast.error("Todos os exercícios precisam de um nome.");
      return;
    }

    setIsSubmitting(true);
    try {
      await workoutService.createWorkoutPlan(name, description, assignedTo, exercises as any, videoUrl);
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
          <input 
            type="text"
            placeholder="URL do vídeo do treino (opcional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all"
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Dumbbell size={18} />
                  </div>
                  <div className="flex-1 relative">
                    <div 
                      className="w-full cursor-pointer group/name"
                      onClick={() => {
                        setActiveExerciseIndex(index);
                        setSearchTerm("");
                      }}
                    >
                      {ex.name ? (
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-slate-900 dark:text-white group-hover/name:text-indigo-500 transition-colors">
                            {ex.name}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-500/50">Clique para alterar</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 group-hover/name:text-indigo-400 transition-colors">
                          <Search size={16} />
                          <span className="text-lg font-bold italic">Selecionar da biblioteca...</span>
                        </div>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {activeExerciseIndex === index && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700"
                        >
                          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                              <input 
                                autoFocus
                                type="text"
                                placeholder="Buscar exercício..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-sm font-bold outline-none border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                            </div>
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto scrollbar-hide">
                            {filteredLibrary.length > 0 ? (
                              filteredLibrary.map((libEx) => (
                                <button
                                  key={libEx.id}
                                  onClick={() => selectFromLibrary(libEx)}
                                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                                >
                                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                    <Dumbbell size={14} />
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200">{libEx.name}</div>
                                    <div className="text-[10px] text-slate-400 line-clamp-1">{libEx.description}</div>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="p-8 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum exercício encontrado</p>
                                <button 
                                  onClick={() => navigate('/admin-exercises')}
                                  className="mt-2 text-xs font-black text-indigo-500 hover:underline"
                                >
                                  CADASTRAR NOVO
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => setActiveExerciseIndex(null)}
                            className="w-full p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-t border-slate-100 dark:border-slate-700 transition-colors"
                          >
                            Fechar
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button 
                    onClick={() => removeExercise(index)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
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

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Vídeo da Execução (URL)</label>
                  <input 
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={ex.video_url}
                    onChange={(e) => updateExercise(index, 'video_url', e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-800 p-4 text-sm font-medium text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700"
                  />
                </div>
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
