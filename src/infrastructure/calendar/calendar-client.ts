import * as Calendar from 'expo-calendar';

import { CalendarEvent } from '@/features/calendar/calendar-event';

export interface CalendarClient {
  listEvents(from: Date, to: Date): Promise<CalendarEvent[]>;
}

export const deviceCalendarClient: CalendarClient = {
  async listEvents(from, to) {
    const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
    const events = await Calendar.listEvents(calendars, from, to);
    return events.map((event) => ({
      id: event.id,
      calendarId: event.calendarId,
      title: event.title || '名称未設定の予定',
      startAt: new Date(event.startDate).toISOString(),
      endAt: new Date(event.endDate).toISOString(),
      location: event.location ?? undefined,
      allDay: event.allDay,
    })).sort((a, b) => a.startAt.localeCompare(b.startAt));
  },
};
