// ═══════════════════════════════════════════════════════════════════
// DentVision SaaS - Main Entry Point
// Модульная архитектура с разделением на компоненты
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './hooks/useData';
import './styles/global.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export * from './utils/constants';
export * from './utils/supabase';
export * from './hooks/useData';
export * from './components/ui/BaseComponents';
export { default as Odontogram3D } from './components/Odontogram3D';
