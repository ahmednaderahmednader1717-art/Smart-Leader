// Firebase Cache Management
import { db } from './firebase';

class FirebaseCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generate cache key
  generateKey(collection, query = {}) {
    return `${collection}_${JSON.stringify(query)}`;
  }

  // Get cached data
  get(collection, query = {}) {
    const key = this.generateKey(collection, query);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    return null;
  }

  // Set cache data
  set(collection, query = {}, data) {
    const key = this.generateKey(collection, query);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear cache
  clear(collection = null) {
    if (collection) {
      const keysToDelete = [];
      for (const key of this.cache.keys()) {
        if (key.startsWith(collection)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  // Get cache size
  getSize() {
    return this.cache.size;
  }
}

export const firebaseCache = new FirebaseCache();
