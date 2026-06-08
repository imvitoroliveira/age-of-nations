import { useMeasurements } from "@/hooks/useMeasurements";
import { useProfile } from "@/hooks/useProfile";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Scale, Ruler, TrendingUp, TrendingDown, Plus, X } from "lucide-react";
import { workoutSessionService } from "@/services/workoutSession.service";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Progress() {
  const { data: measurements, addMeasurement, isAdding } = useMeasurements();
  const { data: profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  
  const [formData, setFormData] = useState({
    weight_kg: "",
    waist_cm: "",
    thigh_cm: "",
    hip_cm: ""
  });

  const { data: sessions } = useQuery({
    queryKey: ['workout_sessions', profile?.id],
    queryFn: () => profile?.id ? workoutSessionService.getSessions(profile.id) : Promise.resolve([]),
    enabled: !!profile?.id
  });

  useEffect(() => {
    if (profile?.last_measurement_date) {
      const lastDate = new Date(profile.last_measurement_date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 30) {
        setShowReminder(true);
      }
    } else if (profile && !profile.last_measurement_date && measurements?.length === 0) {
      setShowReminder(true);
    }
  }, [profile, measurements]);

  const weeklyWorkoutData = (() => {
    if (!sessions || sessions.length === 0) return [];
    
    const weeks: Record<string, number> = {};
    const now = new Date();
    
    // Get last 4 weeks
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(now.getDate() - (i * 7));
      const weekNum = Math.ceil((d.getDate() + 1) / 7); // Simple week estimation
      const label = `S${4-i}`;
      weeks[label] = 0;
    }

    sessions.forEach(session => {
      const sessionDate = new Date(session.finished_at);
      const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays <= 28) {
        const weekIdx = 4 - Math.floor(diffDays / 7);
        if (weekIdx >= 1 && weekIdx <= 4) {
          const label = `S${weekIdx}`;
          weeks[label] = (weeks[label] || 0) + 1;
        }
      }
    });

    return Object.entries(weeks).map(([name, value]) => ({ w: name, v: value })).sort((a, b) => a.w.localeCompare(b.w));
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight_kg) {
      toast.error("O peso é obrigatório");
      return;
    }

    addMeasurement({
      weight_kg: parseFloat(formData.weight_kg),
      waist_cm: formData.waist_cm ? parseFloat(formData.waist_cm) : null,
      thigh_cm: formData.thigh_cm ? parseFloat(formData.thigh_cm) : null,
      hip_cm: formData.hip_cm ? parseFloat(formData.hip_cm) : null,
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setShowReminder(false);
        setFormData({ weight_kg: "", waist_cm: "", thigh_cm: "", hip_cm: "" });
      }
    });
  };

  const weightData = measurements?.map(m => ({
    date: new Date(m.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: m.weight_kg
  })) || [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display">Progresso</h2>
          <p className="text-text-muted">Acompanhe sua evolução física.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95 hover:scale-110"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {showReminder && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-indigo-600 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Scale size={24} />
              <div>
                <p className="font-bold">Hora de atualizar suas medidas!</p>
                <p className="text-sm text-indigo-100">Faz mais de um mês desde sua última pesagem.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
            >
              Atualizar Agora
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <Scale className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Peso Atual</span>
          </div>
          <p className="text-3xl font-bold">
            {measurements?.[measurements.length - 1]?.weight_kg || profile?.initial_weight || "---"} 
            <span className="text-sm font-medium text-text-muted ml-1">kg</span>
          </p>
          {measurements && measurements.length > 1 && (
            <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${
              measurements[measurements.length - 1].weight_kg! < measurements[measurements.length - 2].weight_kg! 
                ? "text-green-500" 
                : "text-red-500"
            }`}>
              {measurements[measurements.length - 1].weight_kg! < measurements[measurements.length - 2].weight_kg! ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              <span>
                {Math.abs(measurements[measurements.length - 1].weight_kg! - measurements[measurements.length - 2].weight_kg!).toFixed(1)}kg desde a última
              </span>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <Ruler className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Cintura</span>
          </div>
          <p className="text-3xl font-bold">
            {measurements?.[measurements.length - 1]?.waist_cm || "---"} 
            <span className="text-sm font-medium text-text-muted ml-1">cm</span>
          </p>
          {measurements && measurements.length > 1 && measurements[measurements.length - 1].waist_cm && measurements[0].waist_cm && (
            <div className="mt-2 flex items-center gap-1 text-green-500 text-sm font-bold">
              <TrendingDown size={14} />
              <span>{Math.abs(measurements[measurements.length - 1].waist_cm! - measurements[0].waist_cm!).toFixed(1)}cm total</span>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <TrendingUp className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Coxa</span>
          </div>
          <p className="text-3xl font-bold">
            {measurements?.[measurements.length - 1]?.thigh_cm || "---"}
            <span className="text-sm font-medium text-text-muted ml-1">cm</span>
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <Plus className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Quadril</span>
          </div>
          <p className="text-3xl font-bold">
            {measurements?.[measurements.length - 1]?.hip_cm || "---"}
            <span className="text-sm font-medium text-text-muted ml-1">cm</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h4 className="mb-6 font-bold">Evolução de Peso</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--color-primary)" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h4 className="mb-6 font-bold">Treinos por Semana</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyWorkoutData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis hide />
                <Bar dataKey="v" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-slate-900"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Nova Medição</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({...formData, weight_kg: e.target.value})}
                    className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800"
                    placeholder="Ex: 75.5"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Cintura (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.waist_cm}
                      onChange={(e) => setFormData({...formData, waist_cm: e.target.value})}
                      className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800"
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Coxa (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.thigh_cm}
                      onChange={(e) => setFormData({...formData, thigh_cm: e.target.value})}
                      className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800"
                      placeholder="55"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Quadril (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.hip_cm}
                      onChange={(e) => setFormData({...formData, hip_cm: e.target.value})}
                      className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800"
                      placeholder="95"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isAdding}
                  className="w-full rounded-2xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                >
                  {isAdding ? "Salvando..." : "Salvar Medidas"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
