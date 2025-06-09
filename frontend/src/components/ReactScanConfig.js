// React Scan Configuration Component for Diamond Lab Store
// This component provides additional React Scan configuration and utilities

import { useEffect } from 'react';

export const ReactScanConfig = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Add custom React Scan event listeners for Diamond Lab Store
    const handleRender = (fiber, renders) => {
      // Log only components with performance issues
      const slowRenders = renders.filter(render => render.time > 16); // > 16ms
      if (slowRenders.length > 0) {
        console.group('🔍 React Scan - Performance Alert');
        console.log('Component:', fiber.type?.name || 'Unknown');
        console.log('Slow renders:', slowRenders);
        console.groupEnd();
      }
    };

    const handleUnnecessaryRenders = () => {
      console.warn('⚠️ React Scan detected unnecessary re-renders. Check component dependencies.');
    };

    // Add development tips
    console.log(`
🚀 Diamond Lab Store - React Scan Active!

Performance Tips:
- Watch for red outlines (slow renders > 16ms)
- Gray outlines indicate unnecessary renders
- Use the toolbar to pause/resume monitoring
- Press Ctrl+Shift+X to toggle React Scan

Key Components to Monitor:
- EngagementRingCarousel (Swiper performance)
- ProductImageGallery (Image loading)
- Home page (Multiple data fetches)
- Products page (Grid rendering)
    `);

  }, []);

  return null; // This component doesn't render anything
};

export default ReactScanConfig; 