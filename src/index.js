// ═══════════════════════════════════════════════════════════════════
// DentVision SaaS - Main Entry Point
// Модульная архитектура с разделением на компоненты
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Рендеринг приложения
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// Экспорт для модульного использования
export * from './utils/constants';
export * from './utils/supabase';
export * from './hooks/useData';
export * from './components/ui/BaseComponents';
export { default as Odontogram3D } from './components/Odontogram3D';
