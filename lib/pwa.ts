/**
 * GymPulse PWA & Push Notification Utilities
 * Proporciona registro de Service Worker, suscripción a Notificaciones Push y disparadores de eventos.
 */

export interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

// 1. Registro del Service Worker en el cliente
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('✅ Service Worker de GymPulse registrado con éxito:', registration.scope);
    return registration;
  } catch (error) {
    console.error('❌ Error al registrar el Service Worker:', error);
    return null;
  }
}

// 2. Solicitud de Permisos de Notificaciones Push
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error solicitando permisos de notificación:', error);
    return 'denied';
  }
}

// 3. Envío de Notificación Local / Push
export async function showLocalNotification(payload: NotificationPayload) {
  if (typeof window === 'undefined') return;

  const permission = await requestNotificationPermission();
  if (permission !== 'granted') return;

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    if (reg && reg.showNotification) {
      await reg.showNotification(payload.title, {
        body: payload.body,
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg',
        tag: payload.tag || 'gympulse-alert',
        data: { url: payload.url || '/member' },
      });
      return;
    }
  }

  // Fallback nativo si el service worker no está listo
  if ('Notification' in window) {
    new Notification(payload.title, {
      body: payload.body,
      icon: '/icons/icon.svg',
    });
  }
}

// 4. Disparadores de Casos de Uso Específicos:

/**
 * Recordatorio de sesión del día
 */
export async function notifyWorkoutReminder(routineName: string = 'Fuerza & Hipertrofia') {
  await showLocalNotification({
    title: '💪 ¡Hora de entrenar hoy!',
    body: `Tu rutina programada "${routineName}" te está esperando. ¡No cortes tu racha!`,
    url: '/member/workout',
    tag: 'workout-reminder',
  });
}

/**
 * Nuevo logro desbloqueado
 */
export async function notifyAchievementUnlocked(badgeName: string = 'Fuego Sagrado') {
  await showLocalNotification({
    title: '🏆 ¡Nuevo Logro Desbloqueado!',
    body: `¡Felicitaciones! Has desbloqueado la insignia "${badgeName}". Mirá tus recompensas.`,
    url: '/member/achievements',
    tag: 'achievement-unlocked',
  });
}

/**
 * Nuevo mensaje o interacción en la comunidad
 */
export async function notifyCommunityMessage(authorName: string = 'Carlos M.', preview: string = '¡Excelente progreso!') {
  await showLocalNotification({
    title: `💬 Nuevo mensaje en Comunidad de ${authorName}`,
    body: `"${preview}" — Hacé clic para responder y apoyar a tus compañeros.`,
    url: '/member/community',
    tag: 'community-message',
  });
}

// 5. Soporte de Persistencia Offline para Rutinas
const OFFLINE_ROUTINE_KEY = 'gympulse_offline_cached_routine';

export function saveRoutineForOffline(routineData: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      OFFLINE_ROUTINE_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        data: routineData,
      })
    );
  } catch (e) {
    console.warn('No se pudo guardar la rutina para modo offline:', e);
  }
}

export function getOfflineRoutine(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(OFFLINE_ROUTINE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data;
  } catch (e) {
    return null;
  }
}
