import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();

  setCache(key: string, data: any, ttl: number = 60000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  hasCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  clearCache(key: string): void {
    this.cache.delete(key);
  }

  clearAllCache(): void {
    this.cache.clear();
  }

  // Wrap một Observable để sử dụng cache với TTL
  cacheObservable<T>(key: string, fallback: Observable<T>, ttl: number = 60000): Observable<T> {
    const cachedData = this.getCache<T>(key);
    if (cachedData) {
      return of(cachedData);
    }
    return fallback.pipe(
      tap(data => this.setCache(key, data, ttl))
    );
  }
}
