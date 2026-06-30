import React, { useState } from 'react';
import { useData, useToast } from '../hooks/useData';
import { PBtn, GBtn, Card, Input, Select, Badge, Modal, Spinner } from '../components/ui/BaseComponents';
import { COLORS, APPOINTMENT_STATUS, PATIENT_CATEGORY, HOURS } from '../utils/constants';

export default function Schedule({ clinic }) {
  const { appointments, patients, doctors, upsertAppointment, deleteAppointment } = useData(clinic?.id);
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    service: '',
    time: '09:00',
    status: 'confirmed',
    notes: ''
  });

  // Group appointments by time slot
  const getAppointmentsForDate = () => {
    return appointments?.filter(apt => apt.date === selectedDate) || [];
  };

  const handleDragStart = (e, apt) => {
    setDraggedAppointment(apt);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, timeSlot) => {
    e.preventDefault();
    if (!draggedAppointment) return;

    try {
      await upsertAppointment({
        ...draggedAppointment,
        time: timeSlot,
        date: selectedDate
      });
      toast.success('Запись перенесена');
    } catch (error) {
      toast.error('Ошибка при переносе записи');
    }
    setDraggedAppointment(null);
  };

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setFormData({
      patientId: '',
      doctorId: '',
      service: '',
      time: '09:00',
      status: 'pending',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditAppointment = (apt) => {
    setEditingAppointment(apt);
    setFormData({
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      service: apt.service,
      time: apt.time,
      status: apt.status,
      notes: apt.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await upsertAppointment({
        ...formData,
        id: editingAppointment?.id,
        clinicId: clinic?.id,
        date: selectedDate
      });
      toast.success(editingAppointment ? 'Запись обновлена' : 'Запись создана');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const handleDelete = async () => {
    if (editingAppointment && confirm('Удалить запись?')) {
      await deleteAppointment(editingAppointment.id);
      toast.success('Запись удалена');
      setIsModalOpen(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'green',
      pending: 'yellow',
      cancelled: 'red',
      completed: 'blue',
      noshow: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labels = {
      confirmed: 'Подтверждено',
      pending: 'Ожидает',
      cancelled: 'Отменено',
      completed: 'Завершено',
      noshow: 'Не явился'
    };
    return labels[status] || status;
  };

  const patientCategories = {
    vip: { bg: 'bg-purple-100', border: 'border-purple-300' },
    regular: { bg: 'bg-blue-100', border: 'border-blue-300' },
    new: { bg: 'bg-green-100', border: 'border-green-300' }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Расписание</h1>
          <p className="text-gray-600">Управление записями пациентов</p>
        </div>
        <PBtn onClick={handleNewAppointment}>+ Новая запись</PBtn>
      </div>

      {/* Date Selector */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
          <GBtn onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
            Сегодня
          </GBtn>
          <div className="flex gap-2 ml-auto">
            <Badge type="green">Подтверждено</Badge>
            <Badge type="yellow">Ожидает</Badge>
            <Badge type="red">Отменено</Badge>
          </div>
        </div>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <div className="space-y-2">
          {HOURS.map((timeSlot) => {
            const slotAppointments = getAppointmentsForDate().filter(apt => apt.time === timeSlot);
            
            return (
              <div
                key={timeSlot}
                className="flex border-b border-gray-100 py-3 min-h-[80px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, timeSlot)}
              >
                <div className="w-24 text-sm font-medium text-gray-600 pt-2">
                  {timeSlot}
                </div>
                <div className="flex-1 flex gap-2">
                  {slotAppointments.length === 0 ? (
                    <div className="text-gray-400 text-sm italic py-2">
                      Нет записей
                    </div>
                  ) : (
                    slotAppointments.map((apt) => {
                      const patient = patients?.find(p => p.id === apt.patientId);
                      const doctor = doctors?.find(d => d.id === apt.doctorId);
                      const category = patientCategories[patient?.category] || patientCategories.regular;
                      
                      return (
                        <div
                          key={apt.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, apt)}
                          onClick={() => handleEditAppointment(apt)}
                          className={`flex-1 max-w-xs p-3 rounded-lg border-l-4 cursor-move hover:shadow-md transition-shadow ${category.bg} ${category.border}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">{patient?.name}</p>
                              <p className="text-sm text-gray-600">{apt.service}</p>
                              <p className="text-xs text-gray-500">{doctor?.name}</p>
                            </div>
                            <Badge type={getStatusColor(apt.status)} size="sm">
                              {getStatusLabel(apt.status)}
                            </Badge>
                          </div>
                          {patient?.category === 'vip' && (
                            <span className="text-xs text-purple-600 font-medium">⭐ VIP</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Waitlist */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Лист ожидания</h3>
        <div className="text-gray-500 text-sm">
          Пациенты, ожидающие освобождения места
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAppointment ? 'Редактировать запись' : 'Новая запись'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Пациент"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              options={[
                { value: '', label: 'Выберите пациента' },
                ...(patients?.map(p => ({ value: p.id, label: p.name })) || [])
              ]}
              required
            />

            <Select
              label="Врач"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              options={[
                { value: '', label: 'Выберите врача' },
                ...(doctors?.map(d => ({ value: d.id, label: d.name })) || [])
              ]}
              required
            />

            <Input
              label="Услуга"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            />

            <Select
              label="Время"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              options={HOURS.map(h => ({ value: h, label: h }))}
              required
            />

            <Select
              label="Статус"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'pending', label: 'Ожидает подтверждения' },
                { value: 'confirmed', label: 'Подтверждено' },
                { value: 'completed', label: 'Завершено' },
                { value: 'cancelled', label: 'Отменено' },
                { value: 'noshow', label: 'Не явился' }
              ]}
              required
            />

            <Input
              label="Заметки"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Комментарии к записи"
            />

            <div className="flex gap-3 pt-4">
              <PBtn type="submit" className="flex-1">
                Сохранить
              </PBtn>
              {editingAppointment && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Удалить
                </button>
              )}
              <GBtn type="button" onClick={() => setIsModalOpen(false)}>
                Отмена
              </GBtn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
