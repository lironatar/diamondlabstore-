import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const CoreWebVitals = ({ 
  enableCLS = true, 
  enableLCP = true, 
  enableFID = true,
  enableINP = true 
}) => {
  useEffect(() => {
    // Core Web Vitals measurement for 2024/2025
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Web Vitals library import with correct function names
      import('web-vitals').then(({ onCLS, onLCP, onFID, onFCP, onTTFB, onINP }) => {
        // Cumulative Layout Shift
        if (enableCLS) {
          onCLS((metric) => {
            console.log('CLS:', metric);
            // Send to analytics
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: metric.name,
                value: Math.round(metric.value * 1000),
                event_label: metric.id,
                non_interaction: true,
              });
            }
          });
        }

        // Largest Contentful Paint
        if (enableLCP) {
          onLCP((metric) => {
            console.log('LCP:', metric);
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: metric.name,
                value: Math.round(metric.value),
                event_label: metric.id,
                non_interaction: true,
              });
            }
          });
        }

        // First Input Delay (Legacy - being replaced by INP)
        if (enableFID) {
          onFID((metric) => {
            console.log('FID:', metric);
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: metric.name,
                value: Math.round(metric.value),
                event_label: metric.id,
                non_interaction: true,
              });
            }
          });
        }

        // Interaction to Next Paint (New metric for 2024/2025)
        if (enableINP) {
          onINP((metric) => {
            console.log('INP:', metric);
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: metric.name,
                value: Math.round(metric.value),
                event_label: metric.id,
                non_interaction: true,
              });
            }
          });
        }

        // First Contentful Paint
        onFCP((metric) => {
          console.log('FCP:', metric);
        });

        // Time to First Byte
        onTTFB((metric) => {
          console.log('TTFB:', metric);
        });
      }).catch((error) => {
        console.warn('web-vitals library failed to load:', error);
      });
    }
  }, [enableCLS, enableLCP, enableFID, enableINP]);

  return (
    <Helmet>
      {/* Critical performance hints for 2024/2025 */}
      <link rel="preload" href="/fonts/heebo-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/heebo-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/heebo-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Critical CSS inlining hint */}
      <link rel="preload" href="/css/critical.css" as="style" />
      
      {/* Resource hints for better Core Web Vitals */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS prefetch for third-party resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.facebook.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      
      {/* Preload critical above-the-fold images */}
      <link rel="preload" href="/images/hero-banner.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/logo.webp" as="image" type="image/webp" />
      
      {/* Critical rendering optimizations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for reducing CLS */
          .hero-section { min-height: 500px; }
          .navbar { height: 80px; }
          .logo { width: 120px; height: 40px; }
          
          /* Font display swap for better LCP */
          @font-face {
            font-family: 'Heebo';
            font-display: swap;
            src: url('/fonts/heebo-400.woff2') format('woff2');
            font-weight: 400;
          }
          
          /* Prevent layout shift for images */
          img { max-width: 100%; height: auto; }
          
          /* Optimize for RTL layout */
          html[dir="rtl"] { 
            font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
          }
        `
      }} />
      
      {/* Advanced performance monitoring script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Performance monitoring for Hebrew/RTL content
          if ('performance' in window && 'PerformanceObserver' in window) {
            // Monitor layout shifts specifically for RTL content
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  console.log('Layout shift detected:', entry.value);
                }
              }
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
            
            // Monitor LCP for jewelry images
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              console.log('LCP element:', lastEntry.element);
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          }
          
          // Optimize font loading for Hebrew text
          if ('fontDisplay' in document.documentElement.style) {
            document.documentElement.style.setProperty('--font-display', 'swap');
          }
        `
      }} />
    </Helmet>
  );
};

export default CoreWebVitals; 