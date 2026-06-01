import { useQuery } from "@tanstack/react-query";
import { workoutService } from "@/services/workout.service";

export function useWorkoutPlans() {
  return useQuery({
    queryKey: ['workout_plans'],
    queryFn: () => workoutService.getWorkoutPlans()
  });
}
