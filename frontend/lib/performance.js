/**
 * Performance Optimization Utilities
 */

class PerformanceService {
  /**
   * Lazy load component
   */
  lazyLoadComponent(importFunc) {
    // Only works in React context
    if (typeof React !== 'undefined' && React.lazy) {
      return React.lazy(importFunc);
    }
    // Fallback for Node.js
    return importFunc;
  }

  /**
   * Preload component
   */
  preloadComponent(importFunc) {
    return () => {
      importFunc();
      return null;
    };
  }

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Memoize expensive function
   */
  memoize(fn) {
    const cache = new Map();
    return function(...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }

  /**
   * Image optimization helper
   */
  optimizeImage(src, width, height, quality = 80) {
    // If using Cloudinary
    if (src.includes('cloudinary.com')) {
      return src.replace('/upload/', `/upload/w_${width},h_${height},q_${quality}/`);
    }
    // For other image services, return original
    return src;
  }

  /**
   * Code splitting helper for routes
   */
  createLazyRoute(importFunc) {
    if (typeof React !== 'undefined' && React.lazy) {
      return {
        component: React.lazy(importFunc),
        loading: () => (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        )
      };
    }
    return { component: importFunc, loading: () => null };
  }

  /**
   * Batch API requests
   */
  batchRequests(requests, batchSize = 5) {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }
    
    return Promise.all(
      batches.map(batch => Promise.all(batch))
    ).then(results => results.flat());
  }

  /**
   * Cache API response
   */
  cacheResponse(key, data, ttl = 300000) { // 5 minutes default
    if (typeof window === 'undefined') return;
    
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  }

  /**
   * Get cached response
   */
  getCachedResponse(key) {
    if (typeof window === 'undefined') return null;
    
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;
    
    const cacheItem = JSON.parse(cached);
    const now = Date.now();
    
    if (now - cacheItem.timestamp > cacheItem.ttl) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    
    return cacheItem.data;
  }

  /**
   * Virtual scrolling helper
   */
  getVisibleItems(items, scrollTop, itemHeight, containerHeight) {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      offsetY: startIndex * itemHeight
    };
  }
}

module.exports = new PerformanceService();

