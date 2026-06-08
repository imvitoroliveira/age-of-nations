import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { workoutService, ExerciseLibrary } from "@/services/workout.service";
import { ChevronLeft, Trash2, Save, Video, Dumbbell, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function AdminExercises() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exercises, setExercises] = useState<ExerciseLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});


  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await workoutService.getExerciseLibrary();
      setExercises(data);
      
      // Load signed URLs for videos
      const urls: Record<string, string> = {};
      for (const ex of data) {
        if (ex.video_url && !ex.video_url.startsWith('http')) {
          try {
            const url = await workoutService.getExerciseVideoUrl(ex.video_url);
            urls[ex.id] = url;
          } catch (e) {
            console.error("Error signing URL:", e);
          }
        } else if (ex.video_url) {
          urls[ex.id] = ex.video_url;
        }
      }
      setSignedUrls(urls);
    } catch (error) {
      toast.error("Erro ao carregar exercícios.");
    } finally {
      setLoading(false);
    }

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "video/mp4") {
        toast.error("Por favor, selecione um arquivo MP4.");
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("O exercício precisa de um nome.");
      return;
    }

    setIsSubmitting(true);
    try {
      let videoUrl = "";
      if (videoFile) {
        videoUrl = await workoutService.uploadExerciseVideo(videoFile);
      }

      await workoutService.addToExerciseLibrary(name, description, videoUrl);
      toast.success("Exercício adicionado à biblioteca!");
      setName("");
      setDescription("");
      setVideoFile(null);
      loadExercises();
    } catch (error: any) {
      toast.error("Erro ao salvar exercício: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExercise = async (id: string, videoUrl?: string | null) => {
    try {
      const { error } = await supabase
        .from('exercise_library' as any)
        .delete()
        .eq('id', id);


      if (error) throw error;

      if (videoUrl) {
        // Optional: delete from storage too if it's a supabase URL
        const fileName = videoUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('exercise-videos').remove([fileName]);
        }
      }

      toast.success("Exercício removido.");
      loadExercises();
    } catch (error: any) {
      toast.error("Erro ao remover: " + error.message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-28 md:pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Biblioteca de Exercícios</h2>
      </div>

      <div className="card-premium space-y-6">
        <section className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Novo Exercício</label>
          <input 
            type="text"
            placeholder="Nome do Exercício (ex: Supino Reto)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all"
          />
          <textarea 
            placeholder="Descrição ou orientações de execução..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all resize-none"
            rows={3}
          />
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Vídeo da Execução (MP4)</label>
            <div className="relative">
              <input 
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label 
                htmlFor="video-upload"
                className="flex items-center justify-center gap-2 w-full p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all cursor-pointer bg-slate-50 dark:bg-slate-900"
              >
                <Video size={24} />
                <span className="font-bold">{videoFile ? videoFile.name : "Clique para selecionar o vídeo"}</span>
              </label>
            </div>
          </div>
        </section>

        <button 
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar na Biblioteca
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Exercícios Cadastrados</label>
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-medium">Nenhum exercício cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {exercises.map((ex) => (
              <motion.div 
                layout
                key={ex.id}
                className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col group aspect-[9/16]"
              >
                {signedUrls[ex.id] ? (
                  <div className="absolute inset-0 z-0">
                    <video 
                      src={signedUrls[ex.id]} 
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <Dumbbell className="text-slate-300 dark:text-slate-700" size={48} />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-4 z-10 space-y-1">
                  <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow-md">{ex.name}</h3>
                  {ex.description && (
                    <p className="text-[10px] text-white/70 line-clamp-2 leading-tight drop-shadow-md">
                      {ex.description}
                    </p>
                  )}
                </div>

                <div className="absolute top-2 right-2 z-20 flex gap-2">
                  <button 
                    onClick={() => deleteExercise(ex.id, ex.video_url)}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-rose-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {signedUrls[ex.id] && (
                  <div className="absolute top-2 left-2 z-20 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider">
                    VÍDEO
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}