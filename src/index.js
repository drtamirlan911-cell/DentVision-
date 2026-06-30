// ═══════════════════════════════════════════════════════════════════
// DentVision SaaS - Main Entry Point
// Модульная архитектура с разделением на компоненты
// ═══════════════════════════════════════════════════════════════════

// Utils & Constants
export * from './utils/constants';
export * from './utils/supabase';

// Custom Hooks
export * from './hooks/useData';

// UI Components
export * from './components/ui/BaseComponents';
export * from './components/Odontogram3D';

// Note: Page components should be imported separately to reduce bundle size
// Example:
// import { SchedulePage } from './pages/Schedule';
// import { PatientsPage } from './pages/Patients';
// import { CashierPage } from './pages/Cashier';
// import { AITeamPage } from './pages/AITeam';

