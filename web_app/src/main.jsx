import React from 'react'

// WARNING: TEMPORARY GLOBAL FILTER DETECTOR FOR DEBUGGING
const originalFilter = Array.prototype.filter;
Array.prototype.filter = function (...args) {
  if (!Array.isArray(this)) {
    console.error("🚨 Unsafe filter call on:", this);
  }
  return originalFilter.apply(this, args);
};
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
