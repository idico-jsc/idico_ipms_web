import { useAuthStore } from "@/features/auth/store/auth-store";
import { apiGet, FetcherOptions } from "@/utils";
import { useCallback } from "react";

export function useApi() {
  const logout = useAuthStore((state) => state.logout);
  
  const GET = useCallback(async <T>(endpoint: string, options?: FetcherOptions): Promise<T> => {
    const response = await apiGet<Response>(endpoint, options);
    const requireAuth = options?.requireAuth;

    if (!response.ok) {
      if (requireAuth && response.status === 403) {
        logout();
      }
      return Promise.reject(new Error(`API GET request failed with status ${response.status}`));
    }

    const data = (await response.json()) as T;
    return data;
  }, []);

  return { GET };
}
