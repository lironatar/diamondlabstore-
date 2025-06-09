// Performance monitoring utilities for React optimization
export const measureRenderTime = (componentName, renderFn) => {
  if (process.env.NODE_ENV === 'development') {
    console.time(`[RENDER] ${componentName}`);
    const result = renderFn();
    console.timeEnd(`[RENDER] ${componentName}`);
    return result;
  }
  return renderFn();
};

export const logMemoization = (componentName, props = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[MEMO] ${componentName} re-rendering with props:`, props);
  }
};

export const measureAsyncOperation = async (operationName, asyncFn) => {
  if (process.env.NODE_ENV === 'development') {
    console.time(`[ASYNC] ${operationName}`);
    try {
      const result = await asyncFn();
      console.timeEnd(`[ASYNC] ${operationName}`);
      return result;
    } catch (error) {
      console.timeEnd(`[ASYNC] ${operationName}`);
      throw error;
    }
  }
  return await asyncFn();
};

export const trackComponentMount = (componentName) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[MOUNT] ${componentName} mounted`);
  }
};

export const trackComponentUnmount = (componentName) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[UNMOUNT] ${componentName} unmounted`);
  }
};

// Performance observer for tracking Core Web Vitals
export const setupPerformanceObserver = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('[LCP]', entry.startTime);
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('[FID]', entry.processingStart - entry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          console.log('[CLS]', entry.value);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
};

// Memoization helper for expensive calculations
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CACHE HIT] ${fn.name || 'anonymous'}`);
      }
      return cache.get(key);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CACHE MISS] ${fn.name || 'anonymous'}`);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}; 