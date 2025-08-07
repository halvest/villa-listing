// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HelmetProvider } from 'react-helmet-async'; // <-- Tambahkan ini

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider> {/* <-- Bungkus App dengan ini */}
      <App />
    </HelmetProvider>
  </React.StrictMode>
);