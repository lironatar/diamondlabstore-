# React Scan Performance Monitoring Guide

## Diamond Lab Store - React Performance Optimization

React Scan has been integrated into the Diamond Lab Store application to help monitor and optimize React component performance in real-time.

## 🚀 What is React Scan?

React Scan is a performance monitoring tool that:
- Visualizes component re-renders in real-time
- Identifies unnecessary re-renders
- Highlights slow-performing components
- Provides insights into React performance issues

## 🔧 Setup & Configuration

React Scan is automatically configured in the Diamond Lab Store and only runs in **development mode**.

### Current Configuration (`src/index.js`):
```javascript
scan({
  enabled: process.env.NODE_ENV === 'development',
  log: false,
  showToolbar: true,
  animationSpeed: "fast",
  trackUnnecessaryRenders: true,
});
```

## 🎯 How to Use React Scan

### Visual Indicators

1. **Red Outlines**: Components that took >16ms to render (slow)
2. **Gray Outlines**: Unnecessary re-renders detected
3. **Green Outlines**: Normal, efficient renders

### Toolbar Features

- **Pause/Resume**: Toggle monitoring on/off
- **Settings**: Adjust animation speed and tracking options
- **Stats**: View performance statistics

### Keyboard Shortcuts

- `Ctrl+Shift+X`: Toggle React Scan on/off
- `Ctrl+Shift+D`: Open React DevTools

## 📊 Key Components to Monitor

### 1. EngagementRingCarousel
- **Location**: `src/components/EngagementRingCarousel.js`
- **Watch for**: Swiper animation performance, image loading delays
- **Performance tips**: Optimize image sizes, lazy loading

### 2. ProductImageGallery
- **Location**: `src/components/ProductImageGallery.js`
- **Watch for**: Image hover effects, gallery transitions
- **Performance tips**: Image caching, reduced animation complexity

### 3. Home Page
- **Location**: `src/pages/Home.js`
- **Watch for**: Multiple API calls, large component tree
- **Performance tips**: Data memoization, component splitting

### 4. Products Grid
- **Location**: `src/pages/Products.js`
- **Watch for**: Grid rendering with many items
- **Performance tips**: Virtualization, pagination

## 🛠 Development Workflow

### Starting Development with React Scan

```bash
# Start development server (React Scan auto-enabled)
npm start

# Alternative: Run with external React Scan CLI
npm run scan
```

### Performance Optimization Checklist

1. **Check for Red Outlines**
   - Optimize expensive computations
   - Use `useMemo` for heavy calculations
   - Implement proper image optimization

2. **Fix Gray Outlines (Unnecessary Renders)**
   - Use `React.memo()` for pure components
   - Optimize dependency arrays in `useEffect`
   - Avoid inline objects/functions in JSX

3. **Monitor Key Interactions**
   - Carousel navigation
   - Product filtering
   - Image gallery interactions
   - Shopping cart updates

## 📈 Performance Targets

### Target Metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Component Render Time**: < 16ms
- **Unnecessary Re-renders**: 0

## 🔍 Common Performance Issues

### Issue: Carousel Lag
**Solution**: Optimize image loading, reduce animation complexity
```javascript
// Good: Memoized image component
const OptimizedImage = React.memo(({ src, alt }) => (
  <img src={src} alt={alt} loading="lazy" />
));
```

### Issue: Frequent Re-renders
**Solution**: Use React.memo and proper dependency management
```javascript
// Good: Memoized component
const ProductCard = React.memo(({ product }) => {
  // Component logic
});
```

### Issue: Slow Product Grid
**Solution**: Implement virtualization or pagination
```javascript
// Good: Pagination instead of showing all products
const itemsPerPage = 20;
const currentItems = products.slice(startIndex, startIndex + itemsPerPage);
```

## 🚨 Debugging Performance Issues

### Console Output
React Scan logs performance alerts in the console:
```
🔍 React Scan - Performance Alert
Component: EngagementRingCarousel
Slow renders: [{ time: 25ms, ... }]
```

### React DevTools Integration
- Use React DevTools Profiler alongside React Scan
- Compare before/after optimization results
- Focus on components with high render counts

## 📋 Best Practices

1. **Only use React Scan in development**
2. **Fix performance issues immediately**
3. **Test on slower devices**
4. **Monitor after each major change**
5. **Use profiling data to guide optimizations**

## 🔗 Additional Resources

- [React Scan GitHub](https://github.com/aidenybai/react-scan)
- [React Performance Guide](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)

## 🎛 Advanced Configuration

For custom monitoring needs, modify `src/components/ReactScanConfig.js`:

```javascript
// Custom performance thresholds
const SLOW_RENDER_THRESHOLD = 16; // ms
const VERY_SLOW_RENDER_THRESHOLD = 50; // ms

// Custom event handlers
const handleRender = (fiber, renders) => {
  // Custom logic for performance monitoring
};
```

---

**Happy Optimizing! 🚀**

Keep your Diamond Lab Store running at peak performance with React Scan monitoring. 