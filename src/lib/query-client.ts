import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient instance with robust default configurations.
 * 
 * - staleTime: 5 minutes - Reduces redundant network requests for frequently accessed data.
 * - gcTime: 10 minutes - Retains cache in memory longer to improve LCP on re-visits.
 * - retry: 2 - Standard retry logic for transient network failures.
 * - refetchOnWindowFocus: false - Prevents aggressive re-fetching, reducing TBT on tab switching.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
