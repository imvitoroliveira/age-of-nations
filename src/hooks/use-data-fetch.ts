import { useQuery } from "@tanstack/react-query";
import { ErrorHandler } from "@/lib/error-handler";

/**
 * Resilient Data Fetching Abstraction.
 * Implement stale-while-revalidate and centralized error management.
 */
export function useDataFetch<T>(
  key: string[],
  fetcher: () => Promise<T>,
  options = {}
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await fetcher();
      } catch (error) {
        throw ErrorHandler.handle(error, `Fetch:${key.join("/")}`);
      }
    },
    ...options,
  });
}
