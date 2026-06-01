import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Scale, Ruler, TrendingUp, TrendingDown, Plus } from "lucide-react";


export default function Progress() {
  const { data: measurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      const { data } = await supabase
        .from('body_measurements')
        .select('*');
      return data || [];
      return data || [];
    }
  });

  const weightData = measurements?.map(m => ({
    date: new Date(m.measured_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: m.weight
  })) || [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display">Progresso</h2>
          <p className="text-text-muted">Acompanhe sua evolução física.</p>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <Scale className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Peso Atual</span>
          </div>
          <p className="text-3xl font-bold">78.5 <span className="text-sm font-medium text-text-muted">kg</span></p>
          <div className="mt-2 flex items-center gap-1 text-green-500 text-sm font-bold">
            <TrendingDown size={14} />
            <span>-1.2kg este mês</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <Ruler className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Cintura</span>
          </div>
          <p className="text-3xl font-bold">84 <span className="text-sm font-medium text-text-muted">cm</span></p>
          <div className="mt-2 flex items-center gap-1 text-green-500 text-sm font-bold">
            <TrendingDown size={14} />
            <span>-2cm total</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <TrendingUp className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">IMC</span>
          </div>
          <p className="text-3xl font-bold">24.2</p>
          <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-600 uppercase">Saudável</span>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <Plus className="text-primary" size={20} />
            <span className="text-[10px] font-bold text-text-muted uppercase">Gordura</span>
          </div>
          <p className="text-3xl font-bold">18 <span className="text-sm font-medium text-text-muted">%</span></p>
          <p className="text-xs text-text-muted mt-2">Estimativa baseada em medidas</p>
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
              <BarChart data={[{w: 'S1', v: 4}, {w: 'S2', v: 5}, {w: 'S3', v: 3}, {w: 'S4', v: 5}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis hide />
                <Bar dataKey="v" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
