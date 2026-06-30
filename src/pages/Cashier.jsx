import React, { useState } from 'react';
import { useData, useToast } from '../hooks/useData';
import { PBtn, GBtn, Card, Input, Select, Badge, Modal, StatCard } from '../components/ui/BaseComponents';
import { COLORS } from '../utils/constants';

export default function Cashier({ clinic }) {
  const { transactions, payments, expenses, payroll, inventory, upsertTransaction } = useData(clinic?.id);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('transactions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    patientId: '',
    service: '',
    paymentMethod: 'cash',
    paymentType: 'full',
    notes: ''
  });

  const stats = {
    todayIncome: 125000,
    todayExpense: 15000,
    monthIncome: 2450000,
    monthExpense: 890000,
    receivables: 340000,
    doctorPayroll: 680000
  };

  const paymentMethods = [
    { value: 'cash', label: 'Наличные' },
    { value: 'card', label: 'Карта' },
    { value: 'kaspi', label: 'Kaspi QR' },
    { value: 'transfer', label: 'Перевод' }
  ];

  const paymentTypes = [
    { value: 'full', label: 'Полная оплата' },
    { value: 'prepayment', label: 'Предоплата' },
    { value: 'installment', label: 'Рассрочка' },
    { value: 'kaspi_installment', label: 'Kaspi Рассрочка' },
    { value: 'credit', label: 'Долг' }
  ];

  const handleNewTransaction = () => {
    setFormData({
      type: 'income',
      amount: '',
      patientId: '',
      service: '',
      paymentMethod: 'cash',
      paymentType: 'full',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await upsertTransaction({
        ...formData,
        clinicId: clinic?.id,
        date: new Date().toISOString(),
        status: 'completed'
      });
      toast.success('Операция добавлена');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Финансы</h1>
          <p className="text-gray-600">Управление доходами и расходами</p>
        </div>
        <PBtn onClick={handleNewTransaction}>+ Операция</PBtn>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Доход за день"
          value={`+${stats.todayIncome.toLocaleString()} ₸`}
          trend="+15%"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Расход за день"
          value={`-${stats.todayExpense.toLocaleString()} ₸`}
          trend="-5%"
          icon="💸"
          color="red"
        />
        <StatCard
          title="Доход за месяц"
          value={`${stats.monthIncome.toLocaleString()} ₸`}
          trend="+22%"
          icon="📊"
          color="green"
        />
        <StatCard
          title="Дебиторская задолженность"
          value={`${stats.receivables.toLocaleString()} ₸`}
          trend="+8%"
          icon="📋"
          color="orange"
        />
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        <div className="flex gap-2 border-b">
          {[
            { id: 'transactions', label: 'Операции' },
            { id: 'receivables', label: 'Долги пациентов' },
            { id: 'payroll', label: 'Зарплата' },
            { id: 'inventory', label: 'Склад' },
            { id: 'expenses', label: 'Расходы' }
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
      <Card>
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Последние операции</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Дата</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Пациент</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Услуга</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Способ</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Тип</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-600">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 text-sm text-gray-700">12.01.2025</td>
                      <td className="p-3 text-sm text-gray-700">Иванов А.А.</td>
                      <td className="p-3 text-sm text-gray-700">Лечение кариеса</td>
                      <td className="p-3">
                        <Badge type="blue">Карта</Badge>
                      </td>
                      <td className="p-3">
                        <Badge type="green">Полная</Badge>
                      </td>
                      <td className="p-3 text-right text-sm font-medium text-green-600">
                        +45 000 ₸
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'receivables' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Долги пациентов</h3>
            <div className="space-y-3">
              {[
                { patient: 'Петров В.В.', amount: 120000, date: '15.12.2024' },
                { patient: 'Сидорова Е.К.', amount: 85000, date: '20.12.2024' },
                { patient: 'Алиев Н.Р.', amount: 135000, date: '05.01.2025' }
              ].map((debt, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{debt.patient}</p>
                    <p className="text-sm text-gray-600">от {debt.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-600">{debt.amount.toLocaleString()} ₸</span>
                    <PBtn size="sm">Напомнить</PBtn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Зарплата сотрудников</h3>
            <div className="space-y-3">
              {[
                { name: 'Д-р Ахметов', role: 'Врач', salary: 450000, paid: 320000 },
                { name: 'Д-р Омарова', role: 'Врач', salary: 380000, paid: 280000 },
                { name: 'Иванова М.', role: 'Администратор', salary: 250000, paid: 250000 }
              ].map((employee, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Начислено: {employee.salary.toLocaleString()} ₸</p>
                      <p className="text-sm font-medium text-green-600">Выплачено: {employee.paid.toLocaleString()} ₸</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(employee.paid / employee.salary) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Склад материалов</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Пломбировочный материал', quantity: 45, unit: 'шт', min: 20 },
                { name: 'Анестетик Ультракаин', quantity: 12, unit: 'уп', min: 15 },
                { name: 'Перчатки латексные', quantity: 150, unit: 'пар', min: 100 },
                { name: 'Боры стоматологические', quantity: 8, unit: 'набор', min: 10 }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    item.quantity <= item.min ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </span>
                    {item.quantity <= item.min ? (
                      <Badge type="red">Заканчивается</Badge>
                    ) : (
                      <Badge type="green">В норме</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Расходы клиники</h3>
            <div className="space-y-3">
              {[
                { category: 'Аренда', amount: 450000, date: '01.01.2025' },
                { category: 'Коммунальные услуги', amount: 85000, date: '05.01.2025' },
                { category: 'Закупка материалов', amount: 320000, date: '10.01.2025' },
                { category: 'Маркетинг', amount: 150000, date: '12.01.2025' }
              ].map((expense, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{expense.category}</p>
                    <p className="text-sm text-gray-600">{expense.date}</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">-{expense.amount.toLocaleString()} ₸</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal for New Transaction */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новая операция">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Тип операции"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'income', label: 'Доход' },
                { value: 'expense', label: 'Расход' }
              ]}
            />

            <Input
              label="Сумма (₸)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            {formData.type === 'income' && (
              <>
                <Input
                  label="Пациент"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="ФИО пациента"
                />

                <Input
                  label="Услуга"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Название услуги"
                />

                <Select
                  label="Способ оплаты"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  options={paymentMethods}
                />

                <Select
                  label="Тип платежа"
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  options={paymentTypes}
                />
              </>
            )}

            {formData.type === 'expense' && (
              <Select
                label="Категория расхода"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                options={[
                  { value: 'rent', label: 'Аренда' },
                  { value: 'utilities', label: 'Коммунальные услуги' },
                  { value: 'materials', label: 'Материалы' },
                  { value: 'marketing', label: 'Маркетинг' },
                  { value: 'salary', label: 'Зарплата' },
                  { value: 'other', label: 'Другое' }
                ]}
              />
            )}

            <Input
              label="Комментарий"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительная информация"
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
