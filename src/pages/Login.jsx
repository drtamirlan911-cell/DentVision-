import React, { useState } from 'react';
import { useAuth } from '../hooks/useData';
import { PBtn, Card, Input, Select, Spinner, Toast } from '../components/ui/BaseComponents';
import { PLANS } from '../utils/constants';

export default function Login({ onLoginSuccess }) {
  const { login, register, loading, error } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clinicName: '',
    phone: '',
    plan: 'basic'
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (isRegistering) {
      if (!formData.clinicName || !formData.phone) {
        setLocalError('Заполните название клиники и телефон');
        return;
      }
      await register(formData);
    } else {
      await login(formData.email, formData.password);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegistering ? 'Регистрация клиники' : 'Вход в DentVision'}
          </h1>
          <p className="text-gray-600">
            {isRegistering ? 'Создайте аккаунт для вашей клиники' : 'Войдите в свой аккаунт'}
          </p>
        </div>

        {(error || localError) && (
          <Toast type="error" message={error || localError} onClose={() => setLocalError('')} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="clinic@example.com"
          />

          <Input
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />

          {isRegistering && (
            <>
              <Input
                label="Название клиники"
                name="clinicName"
                type="text"
                value={formData.clinicName}
                onChange={handleChange}
                required
                placeholder="Стоматология «Улыбка»"
              />

              <Input
                label="Телефон"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+7 (777) 123-45-67"
              />

              <Select
                label="Тарифный план"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                options={[
                  { value: 'basic', label: 'Базовый (Бесплатно)' },
                  { value: 'pro', label: 'Pro (9900 ₸/мес)' },
                  { value: 'enterprise', label: 'Enterprise (24900 ₸/мес)' }
                ]}
              />
            </>
          )}

          <PBtn type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size="sm" /> : isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </PBtn>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>

        {isRegistering && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Тарифные планы:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Базовый:</strong> До 50 пациентов, базовое расписание</li>
              <li>• <strong>Pro:</strong> Безлимитные пациенты, финансы, склад, WhatsApp</li>
              <li>• <strong>Enterprise:</strong> Все функции + API, приоритетная поддержка</li>
            </ul>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href="https://github.com/yourusername/dentvision-saas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-6.24 0-1.38.495-2.52 1.305-3.42-.135-.315-.57-1.635.12-3.405 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.69 1.77.255 3.09.12 3.405.81.9 1.305 2.04 1.305 3.42 0 4.92-2.805 5.94-5.475 6.24.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Исходный код на GitHub
          </a>
        </div>
      </Card>
    </div>
  );
}
