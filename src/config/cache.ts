import logger from './logger';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

class InMemoryCache {
  private store: Map<string, CacheEntry> = new Map();

  set(key: string, data: any, ttlSeconds: number = 60): void {
  this.store.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  logger.debug(`Cache set: ${key} (TTL: ${ttlSeconds}s)`);
}

  get(key: string): any | null {
  const entry = this.store.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    this.store.delete(key);
    return null;
  }

  logger.debug(`Cache hit: ${key}`);
  return entry.data;
}
  delete(key: string): void {
    this.store.delete(key);
  }

  deleteByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }
}

const cache = new InMemoryCache();

export default cache;