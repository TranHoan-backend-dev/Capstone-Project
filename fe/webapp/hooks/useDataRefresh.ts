import { useEffect, useState, useCallback, useRef } from "react";
import { useDataCache, CacheKey } from "@/context/DataCacheContext";

interface UseDataRefreshOptions<T> {
  // Function to fetch data
  fetchFn: () => Promise<T>;
  // Cache key to watch for invalidations
  cacheKey: CacheKey;
  // Initial data
  initialData?: T;
  // Debounce delay (ms) to avoid rapid refetches
  debounceDelay?: number;
  // Whether to refetch on component mount
  refetchOnMount?: boolean;
  // Callback when data is fetched
  onSuccess?: (data: T) => void;
  // Callback on error
  onError?: (error: Error) => void;
}

export interface UseDataRefreshReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
  isStale: boolean;
}

/**
 * Hook để tự động refetch dữ liệu khi cache bị invalidate
 * Cung cấp đầu đủ pattern cho data fetching + cache invalidation
 *
 * @example
 * ```tsx
 * const { data: settlements, loading, refetch } = useDataRefresh({
 *   cacheKey: 'settlements',
 *   fetchFn: () => settlementService.getAll(),
 * });
 * ```
 */
export function useDataRefresh<T>({
  fetchFn,
  cacheKey,
  initialData,
  debounceDelay = 500,
  refetchOnMount = true,
  onSuccess,
  onError,
}: UseDataRefreshOptions<T>): UseDataRefreshReturn<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(refetchOnMount);
  const [error, setError] = useState<Error | undefined>();
  const { isStale, setFresh, onInvalidate } = useDataCache();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Fetch function wrapped with error handling
  const fetch = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(undefined);

        const result = await fetchFn();

        if (isMountedRef.current) {
          setData(result);
          setFresh(cacheKey);
          onSuccess?.(result);
          console.log(`✅ Data refetched for cache key: ${cacheKey}`);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
          console.error(`❌ Error refetching data for ${cacheKey}:`, error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }, debounceDelay);
  }, [fetchFn, cacheKey, setFresh, debounceDelay, onSuccess, onError]);

  // Initial fetch on mount
  useEffect(() => {
    if (refetchOnMount) {
      fetch();
    }

    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [refetchOnMount]); // Dependencies intentionally limited for mount only

  // Subscribe to cache invalidation events
  useEffect(() => {
    const unsubscribe = onInvalidate(cacheKey, fetch);
    return unsubscribe;
  }, [cacheKey, fetch, onInvalidate]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    isStale: isStale(cacheKey),
  };
}

/**
 * Hook đơn giản hơn cho khi chỉ cần lắng nghe cache invalidation
 * 
 * @example
 * ```tsx
 * const { refetch } = useCacheListener('settlements');
 * ```
 */
export function useCacheListener(
  cacheKey: CacheKey,
  onInvalidate?: () => void,
) {
  const { onInvalidate: subscribeToInvalidate, isStale } = useDataCache();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscribeRef.current = subscribeToInvalidate(cacheKey, () => {
      onInvalidate?.();
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [cacheKey, subscribeToInvalidate, onInvalidate]);

  return {
    isStale: isStale(cacheKey),
  };
}
