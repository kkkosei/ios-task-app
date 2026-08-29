export type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  startAt: string;
  endAt: string;
  location?: string;
  allDay: boolean;
};
