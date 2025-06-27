/**
 * Client-side caching utilities for performance optimization
 */

import { CacheWithExpiry } from "./performance";

// Global cache instances
const apiCache = new CacheWithExpiry(5 * 60 * 1000); // 5 minutes
const imageCache = new CacheWithExpiry(30 * 60 * 1000); // 30 minutes
const metadataCache = new CacheWithExpiry(10 * 60 * 1000); // 10 minutes

/**
 * Cache keys generator
 */
export const getCacheKey = (type, ...params) => {
  return `${type}:${params.join(":")}`;
};

/**
 * API response caching
 */
export class ApiCache {
  static set(key, data, ttl) {
    apiCache.set(key, data, ttl);
  }

  static get(key) {
    return apiCache.get(key);
  }

  static has(key) {
    return apiCache.has(key);
  }

  static clear() {
    apiCache.clear();
  }

  static generateKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    return getCacheKey("api", endpoint, paramString);
  }

  // Cache with stale-while-revalidate strategy
  static async getWithSWR(
    key,
    fetchFn,
    staleTTL = 5 * 60 * 1000,
    maxAge = 30 * 60 * 1000,
  ) {
    const cached = apiCache.get(key);

    if (cached) {
      const age = Date.now() - cached.timestamp;

      // If data is fresh, return it
      if (age < staleTTL) {
        return cached.data;
      }

      // If data is stale but not expired, return it and revalidate in background
      if (age < maxAge) {
        // Revalidate in background
        fetchFn()
          .then((newData) => {
            this.set(key, { data: newData, timestamp: Date.now() });
          })
          .catch(console.error);

        return cached.data;
      }
    }

    // Data is expired or doesn't exist, fetch fresh data
    try {
      const newData = await fetchFn();
      this.set(key, { data: newData, timestamp: Date.now() });
      return newData;
    } catch (error) {
      // If fetch fails and we have stale data, return it
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }
}

/**
 * Image caching with blob storage
 */
export class ImageCache {
  static async get(url) {
    // Check memory cache first
    const cached = imageCache.get(url);
    if (cached) return cached;

    // Check IndexedDB for blob storage
    try {
      const blob = await this.getFromIndexedDB(url);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        imageCache.set(url, objectUrl);
        return objectUrl;
      }
    } catch (error) {
      console.warn("Failed to get image from IndexedDB:", error);
    }

    return null;
  }

  static async set(url, imageBlob) {
    try {
      // Store in IndexedDB
      await this.saveToIndexedDB(url, imageBlob);

      // Create object URL for immediate use
      const objectUrl = URL.createObjectURL(imageBlob);
      imageCache.set(url, objectUrl);

      return objectUrl;
    } catch (error) {
      console.warn("Failed to cache image:", error);
      return null;
    }
  }

  static async saveToIndexedDB(url, blob) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ImageCache", 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");

        store.put({
          url,
          blob,
          timestamp: Date.now(),
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "url" });
          store.createIndex("timestamp", "timestamp");
        }
      };
    });
  }

  static async getFromIndexedDB(url) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ImageCache", 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");
        const getRequest = store.get(url);

        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            // Check if cached image is still valid (within 30 minutes)
            const age = Date.now() - result.timestamp;
            if (age < 30 * 60 * 1000) {
              resolve(result.blob);
            } else {
              // Remove expired entry
              store.delete(url);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };

        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  static clear() {
    imageCache.clear();

    // Clear IndexedDB
    const request = indexedDB.open("ImageCache", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      store.clear();
    };
  }
}

/**
 * Component state caching for unmount/remount scenarios
 */
export class ComponentCache {
  static cache = new Map();

  static save(componentKey, state) {
    this.cache.set(componentKey, {
      state,
      timestamp: Date.now(),
    });
  }

  static restore(componentKey, maxAge = 5 * 60 * 1000) {
    const cached = this.cache.get(componentKey);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      this.cache.delete(componentKey);
      return null;
    }

    return cached.state;
  }

  static clear(componentKey) {
    if (componentKey) {
      this.cache.delete(componentKey);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Session storage cache for temporary data
 */
export class SessionCache {
  static set(key, data, ttl = 60 * 60 * 1000) {
    // 1 hour default
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn("Failed to get from session cache:", error);
      return null;
    }
  }

  static remove(key) {
    sessionStorage.removeItem(key);
  }

  static clear() {
    sessionStorage.clear();
  }
}

/**
 * Local storage cache for persistent data
 */
export class LocalCache {
  static set(key, data, ttl = 24 * 60 * 60 * 1000) {
    // 24 hours default
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn("Failed to get from local cache:", error);
      return null;
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

/**
 * Cache management utilities
 */
export const CacheManager = {
  // Clear all caches
  clearAll() {
    ApiCache.clear();
    ImageCache.clear();
    ComponentCache.clear();
    SessionCache.clear();
    // Don't clear localStorage as it might contain important user data
  },

  // Get cache statistics
  getStats() {
    return {
      api: apiCache.size(),
      images: imageCache.size(),
      components: ComponentCache.cache.size,
      session: Object.keys(sessionStorage).length,
      local: Object.keys(localStorage).length,
    };
  },

  // Clean expired entries
  cleanup() {
    // API and image caches clean themselves automatically
    // Clean component cache
    const now = Date.now();
    for (const [key, value] of ComponentCache.cache.entries()) {
      if (now - value.timestamp > 10 * 60 * 1000) {
        // 10 minutes
        ComponentCache.cache.delete(key);
      }
    }
  },
};

// Cleanup expired cache entries periodically
if (typeof window !== "undefined") {
  setInterval(
    () => {
      CacheManager.cleanup();
    },
    5 * 60 * 1000,
  ); // Every 5 minutes
}

export default {
  ApiCache,
  ImageCache,
  ComponentCache,
  SessionCache,
  LocalCache,
  CacheManager,
};
