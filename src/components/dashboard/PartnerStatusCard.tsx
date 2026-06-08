import { motion } from "framer-motion";
import { Users, CheckCircle2, Circle } from "lucide-react";

interface PartnerStatusCardProps {
  name: string;
  trainedToday: boolean;
}

export function PartnerStatusCard({ name, trainedToday }: PartnerStatusCardProps) {
  return (
    <motion.div 
      className="card-premium group"
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
          <Users size={24} />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Double Mode</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border border-white dark:border-slate-800 shadow-sm overflow-hidden">
             <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{name.charAt(0)}</span>
          </div>
          <div className={
            `absolute -bottom-1 -right-1 h-7 w-7 rounded-xl border-4 border-white dark:border-slate-950 flex items-center justify-center
            ${trainedToday ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400 dark:bg-slate-800"}`
          }>
            {trainedToday ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">{name}</h3>
          <div className="flex items-center gap-1.5">
             <p className={`text-sm font-bold tracking-tight ${trainedToday ? "text-green-500" : "text-slate-400"}`}>
               {trainedToday ? "Completado" : "Pendente"}
             </p>
             <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
             <p className="text-xs font-semibold text-slate-400">Hoje</p>
          </div>
        </div>
      </div>
      
      {!trainedToday && (
        <div className="mt-8">
           <button className="w-full py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 transition-all">
             Enviar Incentivo
           </button>
        </div>
      )}
    </motion.div>
  );
}
