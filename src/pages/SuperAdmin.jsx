import React, { useState } from 'react';
import { useData, useToast } from '../hooks/useData';
import { PBtn, GBtn, Card, Input, Select, Badge, Modal, StatCard, Spinner } from '../components/ui/BaseComponents';
import { PLANS } from '../utils/constants';

export default function SuperAdmin({ user }) {
  const { clinics, users, subscriptions } = useData();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('clinics');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'basic',
    status: 'active'
  });

  const stats = {
    totalClinics: 24,
    activeClinics: 18,
    totalUsers: 156,
    monthlyRevenue: 2450000,
    newThisMonth: 5
  };

  const handleSaveClinic = async (e) => {
    e.preventDefault();
    // В реальности здесь был бы API вызов
    toast.success(selectedClinic ? 'Клиника обновлена' : 'Клиника создана');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Super Admin</h1>
          <p className="text-gray-600">Управление всеми клиниками системы</p>
        </div>
        <div className="flex gap-3">
          <GBtn onClick={() => window.open('https://github.com/yourusername/dentvision-saas', '_blank')}>
            GitHub
          </GBtn>
          <PBtn onClick={() => setIsModalOpen(true)}>+ Добавить клинику</PBtn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Всего клиник" value={stats.totalClinics} icon="🏥" />
        <StatCard title="Активные" value={stats.activeClinics} icon="✅" color="green" />
        <StatCard title="Пользователей" value={stats.totalUsers} icon="👥" />
        <StatCard title="Доход за месяц" value={`${(stats.monthlyRevenue / 1000000).toFixed(1)}M ₸`} icon="💰" color="green" />
        <StatCard title="Новых за месяц" value={stats.newThisMonth} icon="🆕" color="blue" />
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        <div className="flex gap-2 border-b">
          {[
            { id: 'clinics', label: 'Клиники' },
            { id: 'users', label: 'Пользователи' },
            { id: 'subscriptions', label: 'Подписки' },
            { id: 'settings', label: 'Настройки' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Content */}
      {activeTab === 'clinics' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Название</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Телефон</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Тариф</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Статус</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Дата регистрации</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 text-sm font-medium text-gray-800">Стоматология «Улыбка» #{i}</td>
                    <td className="p-3 text-sm text-gray-700">clinic{i}@example.com</td>
                    <td className="p-3 text-sm text-gray-700">+7 (777) 123-45-{String(i).padStart(2, '0')}</td>
                    <td className="p-3">
                      <Badge type={i % 3 === 0 ? 'purple' : i % 2 === 0 ? 'blue' : 'gray'}>
                        {i % 3 === 0 ? 'Enterprise' : i % 2 === 0 ? 'Pro' : 'Basic'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge type={i % 5 === 0 ? 'red' : 'green'}>
                        {i % 5 === 0 ? 'Заблокирована' : 'Активна'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {String(new Date().getDate()).padStart(2, '0')}.0{Math.floor(Math.random() * 9) + 1}.2024
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedClinic({ id: i });
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Редактировать
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Блокировать
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Имя</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Роль</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Клиника</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Статус</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 text-sm font-medium text-gray-800">Пользователь {i}</td>
                    <td className="p-3 text-sm text-gray-700">user{i}@example.com</td>
                    <td className="p-3">
                      <Badge type={i % 2 === 0 ? 'blue' : 'green'}>
                        {i % 2 === 0 ? 'Администратор' : 'Врач'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-700">Клиника #{Math.floor(i / 2) + 1}</td>
                    <td className="p-3">
                      <Badge type="green">Активен</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Редактировать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PLANS).map(([key, plan]) => (
              <Card key={key} className={`relative ${key === 'pro' ? 'border-2 border-blue-500' : ''}`}>
                {key === 'pro' && (
                  <Badge type="blue" className="absolute -top-3 right-4">Популярный</Badge>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {plan.price === 0 ? 'Бесплатно' : `${plan.price.toLocaleString()} ₸`}
                  </p>
                  <p className="text-sm text-gray-600">/месяц</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Настройки системы</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Автоматическая регистрация клиник</p>
                <p className="text-sm text-gray-600">Разрешить новую регистрацию без модерации</p>
              </div>
              <Select
                value="enabled"
                options={[
                  { value: 'enabled', label: 'Включено' },
                  { value: 'moderation', label: 'С модерацией' },
                  { value: 'disabled', label: 'Отключено' }
                ]}
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Интеграция с GitHub</p>
                <p className="text-sm text-gray-600">Синхронизация с репозиторием</p>
              </div>
              <PBtn size="sm">Подключить</PBtn>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">WhatsApp интеграция</p>
                <p className="text-sm text-gray-600">API ключ для отправки уведомлений</p>
              </div>
              <Input type="password" placeholder="API ключ" className="w-64" />
            </div>
          </div>
        </Card>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedClinic ? 'Редактировать клинику' : 'Новая клиника'}>
          <form onSubmit={handleSaveClinic} className="space-y-4">
            <Input
              label="Название клиники"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Телефон"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Select
              label="Тарифный план"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              options={[
                { value: 'basic', label: 'Basic' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise' }
              ]}
            />
            <Select
              label="Статус"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Активна' },
                { value: 'suspended', label: 'Заблокирована' }
              ]}
            />
            <div className="flex gap-3 pt-4">
              <PBtn type="submit" className="flex-1">Сохранить</PBtn>
              <GBtn type="button" onClick={() => setIsModalOpen(false)}>Отмена</GBtn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
