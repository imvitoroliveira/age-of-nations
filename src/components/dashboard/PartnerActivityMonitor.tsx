import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Clock, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PartnerActivity {
  id: string;
  name: string;
  completed: boolean;
  timestamp: string;
  type: 'workout_created' | 'workout_completed';
}

export function PartnerActivityMonitor({ partnerId, partnerName }: { partnerId?: string, partnerName?: string }) {
  const [activities, setActivities] = useState<PartnerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) return;

    const fetchActivity = async () => {
      setLoading(true);
      try {
        // Get recent plans created for the partner
        const { data: plans } = await supabase
          .from('workout_plans')
          .select('id, name, created_at')
          .eq('assigned_to', partnerId)
          .order('created_at', { ascending: false })
          .limit(5);

        // Get recent sessions completed by the partner
        const { data: sessions } = await supabase
          .from('workout_sessions')
          .select('id, workout_plan_id, finished_at, workout_plans(name)')
          .eq('user_id', partnerId)
          .order('finished_at', { ascending: false })
          .limit(5);

        const allActivities: PartnerActivity[] = [];

        plans?.forEach(p => {
          allActivities.push({
            id: p.id,
            name: (p.name as string) || "Treino",
            completed: false,
            timestamp: p.created_at,
            type: 'workout_created'
          });
        });

        sessions?.forEach(s => {
          const planName = (s as any).workout_plans?.name || "Treino";
          allActivities.push({
            id: s.id,
            name: planName,
            completed: true,
            timestamp: s.finished_at || new Date().toISOString(),
            type: 'workout_completed'
          });
        });

        // Sort by recency
        setActivities(allActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 5));
      } catch (error) {
        console.error("Error fetching partner activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();

    // Subscribe to changes
    const channel = supabase
      .channel('partner-activity')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'workout_sessions',
        filter: `user_id=eq.${partnerId}`
      }, () => fetchActivity())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId]);

  if (!partnerId) return null;

  return (
    <div className="card-premium h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          Acompanhamento {partnerName ? `da ${partnerName}` : ''}
        </h4>
      </div>

      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {activities.map((activity) => (
                <motion.div 
                  layout
                  key={activity.id + activity.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    activity.completed 
                      ? "bg-green-50 dark:bg-green-900/20 text-green-500" 
                      : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"
                  )}>
                    {activity.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {activity.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {activity.completed ? 'Concluído' : 'Pendente'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <Dumbbell className="text-slate-200 dark:text-slate-800 mb-2" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sem atividades recentes</p>
          </div>
        )}
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
