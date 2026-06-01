import { useQuery } from "@tanstack/react-query";
import { measurementService } from "@/services/measurement.service";

export function useMeasurements() {
  return useQuery({
    queryKey: ['measurements'],
    queryFn: () => measurementService.getMeasurements()
  });
}
