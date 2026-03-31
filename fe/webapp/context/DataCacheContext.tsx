"use client";

import React, { createContext, useContext, useCallback, useRef } from "react";

export type CacheKey = 
  | "settlements"
  | "receipts"
  | "customers"
  | "installations"
  | "surveys"
  | "constructions"
  | "contracts"
  | "employees"
  | "departments"
  | "devices"
  | "materials"
  | "categories"
  | string; // Allow custom cache keys

interface DataCacheContextType {
  // Invalidate specific cache key
  invalidate: (key: CacheKey | CacheKey[]) => void;
  // Subscribe to cache invalidation events
  onInvalidate: (key: CacheKey, callback: () => void) => () => void;
  // Check if data is stale
  isStale: (key: CacheKey) => boolean;
  // Set data freshness
  setFresh: (key: CacheKey) => void;
  // Get all stale keys
  getStaleKeys: () => CacheKey[];
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(
  undefined,
);

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error("useDataCache must be used within DataCacheProvider");
  }
  return context;
};

interface DataCacheProviderProps {
  children: React.ReactNode;
}

export const DataCacheProvider: React.FC<DataCacheProviderProps> = ({
  children,
}) => {
  const staleKeys = useRef<Set<CacheKey>>(new Set());
  const invalidationCallbacks = useRef<Map<CacheKey, Set<() => void>>>(
    new Map(),
  );

  const invalidate = useCallback((keys: CacheKey | CacheKey[]) => {
    const keysArray = Array.isArray(keys) ? keys : [keys];

    keysArray.forEach((key) => {
      staleKeys.current.add(key);

      // Call all subscribers for this key
      const callbacks = invalidationCallbacks.current.get(key);
      if (callbacks) {
        callbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            console.error(`Error in cache invalidation callback for ${key}:`, error);
          }
        });
      }
    });

    console.log(`🔄 Cache invalidated for keys:`, keysArray);
  }, []);

  const onInvalidate = useCallback(
    (key: CacheKey, callback: () => void): (() => void) => {
      if (!invalidationCallbacks.current.has(key)) {
        invalidationCallbacks.current.set(key, new Set());
      }
      invalidationCallbacks.current.get(key)!.add(callback);

      // Return unsubscribe function
      return () => {
        invalidationCallbacks.current.get(key)?.delete(callback);
      };
    },
    [],
  );

  const isStale = useCallback((key: CacheKey): boolean => {
    return staleKeys.current.has(key);
  }, []);

  const setFresh = useCallback((key: CacheKey) => {
    staleKeys.current.delete(key);
  }, []);

  const getStaleKeys = useCallback((): CacheKey[] => {
    return Array.from(staleKeys.current);
  }, []);

  const value: DataCacheContextType = {
    invalidate,
    onInvalidate,
    isStale,
    setFresh,
    getStaleKeys,
  };

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
};
