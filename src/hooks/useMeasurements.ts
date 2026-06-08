import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { measurementService } from "@/services/measurement.service";
import { toast } from "sonner";

export function useMeasurements() {
  const queryClient = useQueryClient();

  const measurementsQuery = useQuery({
    queryKey: ['measurements'],
    queryFn: () => measurementService.getMeasurements()
  });

  const addMeasurementMutation = useMutation({
    mutationFn: (measurement: Parameters<typeof measurementService.addMeasurement>[0]) => 
      measurementService.addMeasurement(measurement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Medidas atualizadas com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao salvar medidas");
    }
  });

  return {
    ...measurementsQuery,
    addMeasurement: addMeasurementMutation.mutate,
    isAdding: addMeasurementMutation.isPending
  };
}
