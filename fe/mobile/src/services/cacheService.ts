/**
 * Simple in-memory cache for data between screens
 */
class CacheService {
  private cache: Map<string, any> = new Map();

  /**
   * Set data to cache
   * @param key Unique key for the data (e.g., 'customers:roadmap_id' or 'routes:period')
   * @param data The data to store
   */
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Get data from cache
   * @param key The key to look up
   * @param maxAge Max allowed age in milliseconds (default 5 minutes)
   */
  get(key: string, maxAge: number = 300000): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Clear a specific key
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
