import React, { useState } from 'react';
import { useData, useToast, usePhotoProtocol } from '../hooks/useData';
import { PBtn, GBtn, Card, Input, Select, Badge, Modal, Spinner, Toast } from '../components/ui/BaseComponents';
import Odontogram3D from '../components/Odontogram3D';
import { COLORS, TOOTH_STATUS, TOOTH_SURFACES } from '../utils/constants';

export default function Patients({ clinic }) {
  const { patients, appointments, treatments, upsertPatient, addTreatment } = useData(clinic?.id);
  const photoProtocol = usePhotoProtocol(clinic?.id);
  const toast = useToast();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    category: 'regular',
    notes: ''
  });

  const filteredPatients = patients?.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  ) || [];

  const handleNewPatient = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      birthDate: '',
      category: 'regular',
      notes: ''
    });
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      email: patient.email || '',
      birthDate: patient.birthDate || '',
      category: patient.category || 'regular',
      notes: patient.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await upsertPatient({
        ...formData,
        id: selectedPatient?.id,
        clinicId: clinic?.id
      });
      toast.success(selectedPatient ? 'Данные обновлены' : 'Пациент добавлен');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const getCategoryBadge = (category) => {
    const config = {
      vip: { type: 'purple', label: '⭐ VIP' },
      regular: { type: 'blue', label: 'Постоянный' },
      new: { type: 'green', label: 'Новый' }
    };
    const { type, label } = config[category] || config.regular;
    return <Badge type={type}>{label}</Badge>;
  };

  // Photo Protocol Component
  const PhotoProtocolSection = ({ patient }) => {
    const [photos, setPhotos] = useState([]);
    const [category, setCategory] = useState('smile');
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [comparisonMode, setComparisonMode] = useState(false);

    const categories = {
      smile: 'Улыбка',
      face: 'Лицо',
      intraoral: 'Интраоральные'
    };

    const handlePhotoUpload = (e) => {
      const files = Array.from(e.target.files);
      // В реальности здесь была бы загрузка на сервер
      const newPhotos = files.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        category,
        date: new Date().toISOString(),
        type: 'before'
      }));
      setPhotos([...photos, ...newPhotos]);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-2 rounded-lg ${
                category === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 py-2 rounded-lg ${
              comparisonMode ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Сравнение
          </button>
          <button
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            className={`px-4 py-2 rounded-lg ${
              isDrawingMode ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Рисование
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="text-gray-500">
              📷 Нажмите для загрузки фото или перетащите файлы сюда
            </div>
          </label>
        </div>

        {photos.length > 0 && (
          <div className={`grid ${comparisonMode ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-4'}`}>
            {photos.filter(p => p.category === category).map((photo) => (
              <Card key={photo.id} className="relative overflow-hidden">
                <img src={photo.url} alt="Patient" className="w-full h-48 object-cover" />
                <div className="p-2">
                  <p className="text-xs text-gray-500">{new Date(photo.date).toLocaleDateString()}</p>
                  {isDrawingMode && (
                    <div className="mt-2 flex gap-2">
                      <button className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        ✏️ Рисовать
                      </button>
                      <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        📝 Аннотация
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Пациенты</h1>
            <p className="text-gray-600">База пациентов клиники</p>
          </div>
          <PBtn onClick={handleNewPatient}>+ Новый пациент</PBtn>
        </div>

        <Card className="mb-6">
          <Input
            placeholder="Поиск по имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800">{patient.name}</h3>
                {getCategoryBadge(patient.category)}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 {patient.phone}</p>
                {patient.email && <p>✉️ {patient.email}</p>}
                <p>🦷 Последнее посещение: {patient.lastVisit || 'Нет данных'}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for Add/Edit Patient */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedPatient ? 'Редактировать пациента' : 'Новый пациент'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="ФИО"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Телефон"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
              />
              <Input
                label="Дата рождения"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                type="date"
              />
              <Select
                label="Категория"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: 'new', label: 'Новый' },
                  { value: 'regular', label: 'Постоянный' },
                  { value: 'vip', label: 'VIP' }
                ]}
              />
              <Input
                label="Заметки"
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

  // Patient Detail View
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <GBtn onClick={() => setSelectedPatient(null)}>← Назад к списку</GBtn>
        <div className="flex gap-2">
          <PBtn onClick={() => handleEditPatient(selectedPatient)}>Редактировать</PBtn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedPatient.name}</h2>
          {getCategoryBadge(selectedPatient.category)}
          <div className="mt-4 space-y-3">
            <p className="text-gray-700">📞 {selectedPatient.phone}</p>
            {selectedPatient.email && <p className="text-gray-700">✉️ {selectedPatient.email}</p>}
            <p className="text-gray-700">📅 Дата рождения: {selectedPatient.birthDate || 'Не указана'}</p>
            <p className="text-gray-700">🦷 Последний визит: {selectedPatient.lastVisit || 'Нет данных'}</p>
          </div>
        </Card>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex gap-2 border-b mb-4">
              {['info', 'odontogram', 'photos', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'info' && 'Информация'}
                  {tab === 'odontogram' && 'Зубная формула'}
                  {tab === 'photos' && 'Фотопротокол'}
                  {tab === 'history' && 'История'}
                </button>
              ))}
            </div>

            {activeTab === 'odontogram' && (
              <Odontogram3D patientId={selectedPatient.id} />
            )}

            {activeTab === 'photos' && (
              <PhotoProtocolSection patient={selectedPatient} />
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">План лечения</h3>
                <div className="text-gray-600 text-sm">
                  Автоматически сформированный план лечения будет отображаться здесь
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">История посещений</h3>
                <div className="text-gray-600 text-sm">
                  История всех визитов и изменений в карте пациента
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
