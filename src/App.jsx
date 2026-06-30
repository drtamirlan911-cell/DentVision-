import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Patients from './pages/Patients';
import Cashier from './pages/Cashier';
import Lab from './pages/Lab';
import AITeam from './pages/AITeam';
import SuperAdmin from './pages/SuperAdmin';
import { useAuth } from './hooks/useData';

// Главный компонент приложения
export default function App() {
  const { user, clinic, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Навигация для разных ролей
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'schedule', label: 'Расписание', icon: '📅' },
      { id: 'patients', label: 'Пациенты', icon: '🦷' },
      { id: 'cashier', label: 'Финансы', icon: '💰' },
      { id: 'lab', label: 'Лаборатория', icon: '🔬' },
      { id: 'ai', label: 'AI Команда', icon: '🤖' }
    ];

    if (user?.role === 'super_admin') {
      return [...commonItems, { id: 'admin', label: 'Super Admin', icon: '⚙️' }];
    }

    return commonItems;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} clinic={clinic} />;
      case 'schedule':
        return <Schedule clinic={clinic} />;
      case 'patients':
        return <Patients clinic={clinic} />;
      case 'cashier':
        return <Cashier clinic={clinic} />;
      case 'lab':
        return <Lab clinic={clinic} />;
      case 'ai':
        return <AITeam clinic={clinic} />;
      case 'admin':
        return <SuperAdmin user={user} />;
      default:
        return <Dashboard user={user} clinic={clinic} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка DentVision...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  const menuItems = getMenuItems();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r fixed h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">🦷 DentVision</h1>
          <p className="text-xs text-gray-500 mt-1">{clinic?.name || 'Клиника'}</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {renderPage()}
      </main>
    </div>
  );
}
