import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // only retry failed requests once
      staleTime: 1000 * 30, // data stays fresh for 30 seconds
      refetchOnWindowFocus: false, // don't refetch when switching tabs
    },
    mutations: {
      retry: 0, // never auto-retry mutations (PATCH/POST/DELETE)
    },
  },
});

export default queryClient;
