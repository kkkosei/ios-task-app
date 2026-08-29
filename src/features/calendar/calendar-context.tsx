import * as Calendar from 'expo-calendar';
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';

import { deviceCalendarClient } from '@/infrastructure/calendar/calendar-client';
import { CalendarEvent } from './calendar-event';

type PermissionState = 'checking' | 'granted' | 'denied' | 'unavailable';
type CalendarContextValue = {
  events: CalendarEvent[];
  loading: boolean;
  permission: PermissionState;
  error: string | null;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
};
const CalendarContext = createContext<CalendarContextValue | null>(null);

function todayRange() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 1);
  return { from, to };
}

export function CalendarProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<PermissionState>('checking');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    setLoading(true);
    setError(null);
    try {
      const { from, to } = todayRange();
      setEvents(await deviceCalendarClient.listEvents(from, to));
    } catch {
      setError('カレンダーの予定を読み込めませんでした。');
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      setPermission('unavailable');
      setLoading(false);
      return;
    }
    const result = await Calendar.requestCalendarPermissions(false);
    const granted = result.status === 'granted';
    setPermission(granted ? 'granted' : 'denied');
    setLoading(false);
    if (granted) await refresh();
  }, [refresh]);

  useEffect(() => {
    void (async () => {
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        setPermission('unavailable');
        setLoading(false);
        return;
      }
      const result = await Calendar.getCalendarPermissions();
      if (result.status === 'granted') {
        setPermission('granted');
        await refresh();
      } else {
        setPermission('denied');
        setLoading(false);
      }
    })();
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && permission === 'granted') void refresh();
    });
    return () => subscription.remove();
  }, [permission, refresh]);

  const value = useMemo(() => ({ events, loading, permission, error, connect, refresh }),
    [connect, error, events, loading, permission, refresh]);
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendarEvents() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendarEvents must be used inside CalendarProvider');
  return context;
}
