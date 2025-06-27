/**
 * Performance utilities for React components and application optimization
 */

// Dynamic import helper with error handling
export const lazyImport = (importFunc) => {
  return React.lazy(() =>
    importFunc().catch((error) => {
      console.error("Lazy import failed:", error);
      // Return a fallback component
      return { default: () => <div>Failed to load component</div> };
    }),
  );
};

// Debounce function for performance-critical operations
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Preload images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch multiple DOM operations
export const batchDOMOperations = (operations) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      operations();
      resolve();
    });
  });
};

// Memory-efficient object observer
export const createObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check network connection quality
export const getNetworkInfo = () => {
  if ("connection" in navigator) {
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData,
    };
  }
  return null;
};

// Adaptive loading based on device capabilities
export const shouldLazyLoad = () => {
  const networkInfo = getNetworkInfo();

  // Disable lazy loading on slow connections
  if (networkInfo?.effectiveType === "slow-2g" || networkInfo?.saveData) {
    return false;
  }

  // Check device memory
  if ("deviceMemory" in navigator && navigator.deviceMemory < 4) {
    return true; // Enable lazy loading on low-memory devices
  }

  return true;
};

// Calculate optimal chunk size for virtual scrolling
export const calculateOptimalChunkSize = () => {
  const networkInfo = getNetworkInfo();
  const deviceMemory = navigator.deviceMemory || 4;

  // Base chunk size
  let chunkSize = 20;

  // Adjust based on memory
  if (deviceMemory >= 8) {
    chunkSize = 50;
  } else if (deviceMemory >= 4) {
    chunkSize = 30;
  } else {
    chunkSize = 15;
  }

  // Adjust based on network
  if (networkInfo?.effectiveType === "slow-2g") {
    chunkSize = Math.min(chunkSize, 10);
  } else if (networkInfo?.effectiveType === "4g") {
    chunkSize = Math.min(chunkSize * 1.5, 100);
  }

  return Math.floor(chunkSize);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(`Performance: ${name} took ${end - start} milliseconds`);
    }

    return result;
  };
};

// Cache with expiration
export class CacheWithExpiry {
  constructor(defaultTTL = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Image optimization utilities
export const getOptimizedImageUrl = (originalUrl, width, quality = 80) => {
  if (!originalUrl) return null;

  // For development, return original URL
  if (process.env.NODE_ENV === "development") {
    return originalUrl;
  }

  // Add your image optimization service logic here
  // Example: Cloudinary, ImageKit, etc.
  return originalUrl;
};

// Component render optimization
export const shouldComponentUpdate = (prevProps, nextProps, keys = []) => {
  if (keys.length === 0) {
    return JSON.stringify(prevProps) !== JSON.stringify(nextProps);
  }

  return keys.some((key) => prevProps[key] !== nextProps[key]);
};
