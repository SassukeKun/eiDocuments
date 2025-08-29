import { useState, useEffect, useCallback, useRef } from 'react';
import { GlobalStats } from '@/services/statsService';
import { useGlobalStats } from './useStats';

interface StatsCache {
  data: GlobalStats | null;
  timestamp: number;
  isStale: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useStatsWithCache() {
  const [cache, setCache] = useState<StatsCache>({
    data: null,
    timestamp: 0,
    isStale: true
  });

  const { data, loading, error, refetch } = useGlobalStats();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Atualiza o cache quando novos dados chegam
  useEffect(() => {
    if (data && !loading && !error) {
      setCache({
        data,
        timestamp: Date.now(),
        isStale: false
      });
    }
  }, [data, loading, error]);

  // Verifica se o cache está desatualizado
  const checkCacheStale = useCallback(() => {
    const now = Date.now();
    const isStale = (now - cache.timestamp) > CACHE_DURATION;
    
    if (isStale && cache.data) {
      setCache(prev => ({ ...prev, isStale: true }));
    }
  }, [cache.timestamp, cache.data]);

  // Auto refresh em intervalos
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      checkCacheStale();
      if (cache.isStale) {
        refetch();
      }
    }, 60000); // Verifica a cada minuto

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkCacheStale, cache.isStale, refetch]);

  const forceRefresh = useCallback(() => {
    setCache(prev => ({ ...prev, isStale: true }));
    return refetch();
  }, [refetch]);

  return {
    data: cache.data,
    loading: loading && !cache.data, // Não mostra loading se tem cache
    error,
    isStale: cache.isStale,
    lastUpdate: cache.timestamp,
    forceRefresh
  };
}
