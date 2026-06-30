import React, { useState } from 'react';
import { useData, useToast } from '../hooks/useData';
import { PBtn, GBtn, Card, Input, Select, Badge, Modal, StatCard } from '../components/ui/BaseComponents';
import { COLORS } from '../utils/constants';

export default function AITeam({ clinic }) {
  const toast = useToast();
  const [activeAssistant, setActiveAssistant] = useState('consultant');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Здравствуйте! Я AI-ассистент DentVision. Чем могу помочь?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const assistants = [
    { id: 'consultant', name: 'Консультант', icon: '💬', color: 'blue' },
    { id: 'scheduler', name: 'Администратор', icon: '📅', color: 'green' },
    { id: 'analyst', name: 'Аналитик', icon: '📊', color: 'purple' },
    { id: 'marketing', name: 'Маркетолог', icon: '📣', color: 'orange' }
  ];

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    setChatHistory([...chatHistory, newMessage]);
    setUserInput('');
    setIsProcessing(true);

    // Имитация ответа AI
    setTimeout(() => {
      let response = '';
      switch (activeAssistant) {
        case 'consultant':
          response = 'Я могу помочь с информацией об услугах клиники. Уточните, что вас интересует?';
          break;
        case 'scheduler':
          response = 'Для записи на прием укажите удобное время и врача. Я проверю расписание.';
          break;
        case 'analyst':
          response = 'За текущий месяц: доход +15%, конверсия 68%, средний чек 45 000 ₸. Рекомендую увеличить маркетинговый бюджет.';
          break;
        case 'marketing':
          response = 'Эффективные каналы: Instagram (+24 пациента), рекомендации (+32). Предлагаю запустить акцию на чистку зубов.';
          break;
        default:
          response = 'Чем могу помочь?';
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setIsProcessing(false);
    }, 1000);
  };

  const quickActions = {
    consultant: ['Услуги и цены', 'О врачах', 'Акции', 'Контакты'],
    scheduler: ['Записаться на прием', 'Отменить запись', 'Перенести время', 'Узнать свободные места'],
    analyst: ['Отчет за день', 'Отчет за месяц', 'KPI врачей', 'Прогноз'],
    marketing: ['Статистика рекламы', 'Предложения по продвижению', 'Отзывы пациентов', 'Акции']
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Команда</h1>
        <p className="text-gray-600">Виртуальные ассистенты для автоматизации работы клиники</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assistants List */}
        <Card className="lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-4">Ассистенты</h3>
          <div className="space-y-2">
            {assistants.map((assistant) => (
              <button
                key={assistant.id}
                onClick={() => setActiveAssistant(assistant.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeAssistant === assistant.id
                    ? `bg-${assistant.color}-100 border-2 border-${assistant.color}-500`
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{assistant.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-gray-800">{assistant.name}</p>
                  <p className="text-xs text-gray-500">Онлайн</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Возможности AI:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Автоматические ответы пациентам</li>
              <li>• Управление расписанием</li>
              <li>• Аналитика и отчеты</li>
              <li>• Маркетинговые рекомендации</li>
            </ul>
          </div>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {assistants.find(a => a.id === activeAssistant)?.icon}
              </span>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {assistants.find(a => a.id === activeAssistant)?.name}
                </h3>
                <p className="text-sm text-green-600">● Онлайн</p>
              </div>
            </div>
            <GBtn size="sm" onClick={() => setChatHistory([])}>
              Очистить чат
            </GBtn>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(quickActions[activeAssistant] || []).map((action, idx) => (
              <button
                key={idx}
                onClick={() => setUserInput(action)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {chatHistory.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Введите сообщение..."
              className="flex-1"
            />
            <PBtn onClick={handleSendMessage} disabled={isProcessing || !userInput.trim()}>
              Отправить
            </PBtn>
          </div>
        </Card>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card className="text-center p-6">
          <div className="text-4xl mb-3">🤖</div>
          <h4 className="font-semibold text-gray-800 mb-2">Автоответы</h4>
          <p className="text-sm text-gray-600">
            Мгновенные ответы на вопросы пациентов 24/7
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="text-4xl mb-3">📅</div>
          <h4 className="font-semibold text-gray-800 mb-2">Умное расписание</h4>
          <p className="text-sm text-gray-600">
            Автоматическое заполнение окон в расписании
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="text-4xl mb-3">📈</div>
          <h4 className="font-semibold text-gray-800 mb-2">Прогнозы</h4>
          <p className="text-sm text-gray-600">
            Предсказание загрузки и доходов клиники
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="text-4xl mb-3">🎯</div>
          <h4 className="font-semibold text-gray-800 mb-2">Персонализация</h4>
          <p className="text-sm text-gray-600">
            Индивидуальные предложения для пациентов
          </p>
        </Card>
      </div>
    </div>
  );
}
