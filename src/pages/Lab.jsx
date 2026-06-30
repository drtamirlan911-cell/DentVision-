import React, { useState } from 'react';
import { useData, useToast, useLabOrders } from '../hooks/useData';
import { PBtn, GBtn, Card, Input, Select, Badge, Modal, Spinner } from '../components/ui/BaseComponents';
import { LAB_STATUS } from '../utils/constants';

export default function Lab({ clinic }) {
  const { labOrders, upsertLabOrder } = useLabOrders(clinic?.id);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorId: '',
    labType: 'crown',
    material: '',
    toothNumber: '',
    shade: '',
    dueDate: '',
    notes: '',
    status: 'in_progress'
  });

  const labTypes = [
    { value: 'crown', label: 'Коронка' },
    { value: 'bridge', label: 'Мост' },
    { value: 'veneer', label: 'Винир' },
    { value: 'implant', label: 'Имплант' },
    { value: 'denture', label: 'Протез' },
    { value: 'nightguard', label: 'Капа' },
    { value: 'other', label: 'Другое' }
  ];

  const materials = [
    { value: 'ceramic', label: 'Керамика' },
    { value: 'zirconia', label: 'Диоксид циркония' },
    { value: 'metal_ceramic', label: 'Металлокерамика' },
    { value: 'composite', label: 'Композит' },
    { value: 'pmma', label: 'PMMA' }
  ];

  const getStatusBadge = (status) => {
    const config = {
      in_progress: { type: 'blue', label: 'В работе' },
      ready: { type: 'green', label: 'Готово' },
      delivered: { type: 'gray', label: 'Выдано' },
      delayed: { type: 'red', label: 'Просрочено' },
      cancelled: { type: 'gray', label: 'Отменено' }
    };
    const { type, label } = config[status] || config.in_progress;
    return <Badge type={type}>{label}</Badge>;
  };

  const handleNewOrder = () => {
    setFormData({
      patientName: '',
      doctorId: '',
      labType: 'crown',
      material: '',
      toothNumber: '',
      shade: '',
      dueDate: '',
      notes: '',
      status: 'in_progress'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await upsertLabOrder({
        ...formData,
        clinicId: clinic?.id,
        createdAt: new Date().toISOString()
      });
      toast.success('Заказ создан');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const activeOrders = labOrders?.filter(o => o.status === 'in_progress') || [];
  const readyOrders = labOrders?.filter(o => o.status === 'ready') || [];
  const completedOrders = labOrders?.filter(o => ['delivered', 'cancelled'].includes(o.status)) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Лаборатория</h1>
          <p className="text-gray-600">Управление лабораторными работами</p>
        </div>
        <PBtn onClick={handleNewOrder}>+ Новый заказ</PBtn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-600">{activeOrders.length}</p>
          <p className="text-sm text-gray-600">В работе</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-600">{readyOrders.length}</p>
          <p className="text-sm text-gray-600">Готовы</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-600">{completedOrders.length}</p>
          <p className="text-sm text-gray-600">Завершены</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-red-600">
            {labOrders?.filter(o => o.status === 'delayed').length || 0}
          </p>
          <p className="text-sm text-gray-600">Просрочены</p>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        <div className="flex gap-2 border-b">
          {[
            { id: 'active', label: 'Активные' },
            { id: 'ready', label: 'Готовые' },
            { id: 'completed', label: 'Завершенные' },
            { id: 'waxup', label: 'Wax-Up / Smile Design' }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeTab === 'active' ? activeOrders : 
          activeTab === 'ready' ? readyOrders : 
          activeTab === 'completed' ? completedOrders : []).map((order) => (
          <Card key={order.id} className="relative">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{order.patientName}</h3>
                <p className="text-sm text-gray-600">Врач: {order.doctorName || 'Не указан'}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Тип работы:</span>
                <span className="font-medium">{labTypes.find(t => t.value === order.labType)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Материал:</span>
                <span className="font-medium">{materials.find(m => m.value === order.material)?.label}</span>
              </div>
              {order.toothNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Зуб:</span>
                  <span className="font-medium">{order.toothNumber}</span>
                </div>
              )}
              {order.shade && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Цвет:</span>
                  <span className="font-medium">{order.shade}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Срок:</span>
                <span className={`font-medium ${
                  new Date(order.dueDate) < new Date() && order.status !== 'delivered'
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}>
                  {new Date(order.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {order.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                📝 {order.notes}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {order.status === 'in_progress' && (
                <PBtn 
                  size="sm" 
                  onClick={() => upsertLabOrder({ ...order, status: 'ready' })}
                >
                  Отметить готовым
                </PBtn>
              )}
              {order.status === 'ready' && (
                <PBtn 
                  size="sm"
                  onClick={() => upsertLabOrder({ ...order, status: 'delivered' })}
                >
                  Выдать
                </PBtn>
              )}
              <GBtn size="sm" onClick={() => {
                setFormData(order);
                setIsModalOpen(true);
              }}>
                Редактировать
              </GBtn>
            </div>
          </Card>
        ))}

        {activeTab === 'waxup' && (
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Цифровой Wax-Up / Smile Design</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Загрузить файлы для Wax-Up</p>
                <p className="text-sm mt-2">Поддерживаются форматы: STL, OBJ, DICOM, PNG, JPG</p>
              </div>
              <PBtn>Выбрать файлы</PBtn>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Примеры работ</h4>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-4xl">🦷</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800">Wax-Up #{i}</p>
                      <p className="text-xs text-gray-500">12.01.2025</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeOrders.length === 0 && activeTab !== 'waxup' && (
          <div className="lg:col-span-2 text-center py-12 text-gray-500">
            Нет активных заказов
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Лабораторный заказ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Пациент"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              required
            />

            <Select
              label="Тип работы"
              value={formData.labType}
              onChange={(e) => setFormData({ ...formData, labType: e.target.value })}
              options={labTypes}
              required
            />

            <Select
              label="Материал"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              options={materials}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Номер зуба"
                value={formData.toothNumber}
                onChange={(e) => setFormData({ ...formData, toothNumber: e.target.value })}
                placeholder="Например: 11, 21"
              />

              <Input
                label="Цвет (Shade)"
                value={formData.shade}
                onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
                placeholder="A1, A2, B1..."
              />
            </div>

            <Input
              label="Срок готовности"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />

            <Select
              label="Статус"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'in_progress', label: 'В работе' },
                { value: 'ready', label: 'Готово' },
                { value: 'delivered', label: 'Выдано' },
                { value: 'delayed', label: 'Просрочено' },
                { value: 'cancelled', label: 'Отменено' }
              ]}
              required
            />

            <Input
              label="Комментарии"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительная информация для техника"
              multiline
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
