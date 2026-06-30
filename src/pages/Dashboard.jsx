import React, { useState } from 'react';
import { useAuth, useSubscription } from '../hooks/useData';
import { PBtn, Card, StatCard, Spinner, Badge } from '../components/ui/BaseComponents';
import { COLORS, PLANS } from '../utils/constants';

export default function Dashboard({ user, clinic }) {
  const { logout } = useAuth();
  const { subscription, isLoading } = useSubscription(clinic?.id);
  const [stats, setStats] = useState({
    todayRevenue: 125000,
    monthRevenue: 2450000,
    avgCheck: 45000,
    conversionRate: 68,
    cancellations: 3,
    noShows: 2,
    doctorLoad: [
      { name: 'Д-р Ахметов', load: 85, patients: 12 },
      { name: 'Д-р Омарова', load: 72, patients: 9 },
      { name: 'Д-р Ким', load: 90, patients: 14 }
    ],
    topServices: [
      { name: 'Лечение кариеса', count: 45 },
      { name: 'Чистка зубов', count: 38 },
      { name: 'Удаление', count: 22 },
      { name: 'Имплантация', count: 15 }
    ]
  });

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DentVision</h1>
            <p className="text-sm text-gray-600">{clinic?.name || 'Клиника'}</p>
          </div>
          <div className="flex items-center gap-4">
            {subscription && (
              <Badge 
                type={subscription.plan === 'enterprise' ? 'success' : subscription.plan === 'pro' ? 'warning' : 'info'}
              >
                {PLANS[subscription.plan]?.name || 'Базовый'}
              </Badge>
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Администратор'}</p>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Прибыль за день"
            value={`${stats.todayRevenue.toLocaleString()} ₸`}
            trend="+12%"
            icon="💰"
          />
          <StatCard
            title="Прибыль за месяц"
            value={`${stats.monthRevenue.toLocaleString()} ₸`}
            trend="+8%"
            icon="📊"
          />
          <StatCard
            title="Средний чек"
            value={`${stats.avgCheck.toLocaleString()} ₸`}
            trend="+5%"
            icon="🧾"
          />
          <StatCard
            title="Конверсия"
            value={`${stats.conversionRate}%`}
            trend="+3%"
            icon="📈"
          />
        </div>

        {/* Doctor Load & Top Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Doctor Load */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Загрузка врачей</h3>
            <div className="space-y-4">
              {stats.doctorLoad.map((doctor, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{doctor.name}</span>
                    <span className="text-sm text-gray-600">{doctor.patients} пациентов</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        doctor.load > 80 ? 'bg-red-500' : doctor.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${doctor.load}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Services */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Топ услуг</h3>
            <div className="space-y-3">
              {stats.topServices.map((service, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{service.name}</span>
                  <Badge type="info">{service.count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cancellations & No Shows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Отмены и неявки</h3>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">{stats.cancellations}</p>
                <p className="text-sm text-gray-600">Отмены</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{stats.noShows}</p>
                <p className="text-sm text-gray-600">Неявки</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Эффективность рекламы</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Instagram</span>
                <span className="text-sm font-medium text-green-600">+24 пациента</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Google Ads</span>
                <span className="text-sm font-medium text-green-600">+18 пациентов</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Рекомендации</span>
                <span className="text-sm font-medium text-blue-600">+32 пациента</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
