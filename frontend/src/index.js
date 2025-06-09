// React Scan must be imported before React and React DOM
import { scan } from "react-scan";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configure React Scan
scan({
  enabled: process.env.NODE_ENV === 'development',
  log: false, // Set to true if you want console logging
  showToolbar: true,
  animationSpeed: "fast",
  trackUnnecessaryRenders: true, // This will help identify performance issues
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 