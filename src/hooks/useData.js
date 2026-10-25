// ═══════════════════════════════════════════════════════════════════
// CUSTOM HOOKS
// ═══════════════════════════════════════════════════════════════════

import { createContext, createElement, useContext, useState, useCallback, useEffect } from 'react';
import { upsertRow, deleteRow, verifyLogin } from '../utils/supabase';
import { MEM_CACHE } from '../utils/constants';

const AuthContext = createContext(null);

/**
 * One shared auth state for the entire React tree.
 * Note: the current RPC login does not establish a Supabase Auth session.
 * Backend authorization/session work remains a P0 requirement.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (loginValue, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyLogin(loginValue, password);
      if (!result) {
        setError('Неверный логин или пароль');
        return false;
      }

      const normalizedUser = {
        ...result,
        id: result.id,
        clinicId: result.clinicId ?? result.clinic_id ?? null,
        role: (result.role ?? '').toLowerCase() === 'superadmin'
          ? 'super_admin'
          : (result.role ?? '').toLowerCase(),
        name: result.name ?? result.full_name ?? result.login ?? loginValue,
        login: result.login ?? result.email ?? loginValue,
      };
      const clinicId = normalizedUser.clinicId;
      const normalizedClinic = result.clinic ?? (clinicId
        ? {
            id: clinicId,
            name: result.clinicName ?? result.clinic_name ?? 'Клиника',
          }
        : null);

      setUser(normalizedUser);
      setClinic(normalizedClinic);
      return true;
    } catch (e) {
      setError('Не удалось выполнить вход. Проверьте подключение и попробуйте ещё раз.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async () => {
    setError('Регистрация временно недоступна: серверный сценарий создания клиники ещё не подтверждён.');
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setClinic(null);
    setError(null);
  }, []);

  const value = {
    user, clinic, loading, error, login, register, logout,
    isAuthenticated: Boolean(user),
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Generic state hook backed by Supabase RPC mutations + in-memory cache.
 * @param {string} table - Table name
 * @param {Array} def - Default value
 * @returns {[state, setState, setRawState, {online}]}
 */
export function useCloudTable(table, def) {
  const [state, setState] = useState(def);
  const [online, setOnline] = useState(true);

  const set = useCallback((val) => {
    setState(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      MEM_CACHE[`dv_${table}`] = next;

      const nextIds = new Set(next.map(x => x.id));
      next.forEach(item => {
        const prevItem = prev.find(x => x.id === item.id);
        if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
          upsertRow(table, item).then(() => setOnline(true)).catch(() => setOnline(false));
        }
      });
      prev.forEach(item => {
        if (!nextIds.has(item.id)) {
          deleteRow(table, item.id).then(() => setOnline(true)).catch(() => setOnline(false));
        }
      });

      return next;
    });
  }, [table]);

  return [state, set, setState, { online }];
}

/**
 * Hook for managing toast notifications
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast, clearToast: () => setToast(null) };
}

/**
 * Hook for clinic data management
 */
export function useClinicData(clinicId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clinicId) {
      setLoading(false);
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const cached = MEM_CACHE[`clinic_${clinicId}`];
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    import('../utils/supabase').then(({ loadClinicData }) => {
      loadClinicData(clinicId)
        .then(freshData => {
          if (!cancelled) {
            setData(freshData);
            MEM_CACHE[`clinic_${clinicId}`] = freshData;
          }
        })
        .catch(e => {
          if (!cancelled) setError(String(e?.message || e));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => { cancelled = true; };
  }, [clinicId]);

  return { data, loading, error };
}

/**
 * Hook for appointment management with WhatsApp integration
 */
export function useAppointmentsWithReminders(appointments, setAppointments) {
  const [reminderQueue, setReminderQueue] = useState([]);

  const scheduleReminder = useCallback((appointment) => {
    setReminderQueue(prev => [...prev, { ...appointment, reminded: false }]);
  }, []);

  const sendReminders = useCallback(async () => {
    const { sendAppointmentReminder } = await import('../utils/supabase');

    for (const appt of reminderQueue.filter(r => !r.reminded)) {
      try {
        await sendAppointmentReminder(appt, appt.patient, appt.clinic);
        setReminderQueue(prev =>
          prev.map(r => r.id === appt.id ? { ...r, reminded: true } : r)
        );
      } catch (e) {
        console.error(`Failed to send reminder for ${appt.id}:`, e);
      }
    }
  }, [reminderQueue]);

  return { scheduleReminder, sendReminders, reminderQueue };
}

/**
 * Hook for subscription management
 */
export function useSubscription(clinicId) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    try {
      const { getSubscriptionStatus } = await import('../utils/supabase');
      const status = await getSubscriptionStatus(clinicId);
      setSubscription(status);
    } catch (e) {
      console.error("Failed to get subscription status:", e);
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

  const upgrade = useCallback(async (newPlan) => {
    if (!clinicId) return false;
    setLoading(true);
    try {
      const { createSubscription } = await import('../utils/supabase');
      await createSubscription(clinicId, newPlan, 1);
      await checkStatus();
      return true;
    } catch (e) {
      console.error("Failed to upgrade subscription:", e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clinicId, checkStatus]);

  return { subscription, loading, checkStatus, upgrade };
}

/**
 * Hook for photo protocol management
 */
export function usePhotoProtocol(clinicId) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadPhoto = useCallback(async (photoData) => {
    setLoading(true);
    try {
      const { upsertRow } = await import('../utils/supabase');
      await upsertRow('photos', { ...photoData, clinicId, uploadDate: new Date().toISOString().slice(0, 10) });
      setPhotos(prev => [...prev, photoData]);
      return true;
    } catch (e) {
      console.error("Failed to upload photo:", e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

  const deletePhoto = useCallback(async (photoId) => {
    try {
      const { deleteRow } = await import('../utils/supabase');
      await deleteRow('photos', photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      return true;
    } catch (e) {
      console.error("Failed to delete photo:", e);
      return false;
    }
  }, []);

  return { photos, loading, uploadPhoto, deletePhoto };
}

/**
 * Hook for laboratory orders management
 */
export function useLabOrders(clinicId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    try {
      const { upsertRow } = await import('../utils/supabase');
      const newOrder = { ...orderData, clinicId, status: 'pending', createdAt: new Date().toISOString().slice(0, 10) };
      await upsertRow('lab_orders', newOrder);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (e) {
      console.error("Failed to create lab order:", e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const { upsertRow } = await import('../utils/supabase');
      const order = orders.find(o => o.id === orderId);
      if (!order) return false;

      const updated = { ...order, status: newStatus };
      await upsertRow('lab_orders', updated);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      return true;
    } catch (e) {
      console.error("Failed to update order status:", e);
      return false;
    }
  }, [orders]);

  return { orders, loading, createOrder, updateOrderStatus };
}

export function useData(clinicId) {
  return useCloudTable('patients', []);
}
