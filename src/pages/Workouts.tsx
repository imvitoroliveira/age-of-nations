import { Plus, Dumbbell } from "lucide-react";
import { WorkoutCard } from "@/components/workouts/WorkoutCard";
import { useWorkoutPlans } from "@/hooks/useWorkoutPlans";

export default function Workouts() {
  const { data: plans, isLoading } = useWorkoutPlans();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display">Meus Treinos</h2>
          <p className="text-text-muted">Gerencie seus planos e os do seu parceiro.</p>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-95">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse rounded-3xl bg-white" />)
        ) : (
          plans?.map((plan) => (
            <WorkoutCard key={plan.id} plan={plan} />
          ))
        )}
      </div>

      {!isLoading && plans?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-bg">
            <Dumbbell size={40} className="text-text-muted/30" />
          </div>
          <h3 className="text-lg font-bold">Nenhum plano encontrado</h3>
          <p className="text-text-muted">Comece criando seu primeiro plano de treino!</p>
        </div>
      )}
    </div>
  );
}
