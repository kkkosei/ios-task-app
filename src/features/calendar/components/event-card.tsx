import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Task, getTaskProgress } from '@/features/tasks/task';
import { palette, radius, spacing } from '@/shared/theme/tokens';
import { CalendarEvent } from '../calendar-event';
import { ProgressDot } from './progress-dot';

type Props = { event: CalendarEvent; tasks: Task[] };
const time = (value: string) => new Intl.DateTimeFormat('ja-JP', {
  hour: '2-digit', minute: '2-digit',
}).format(new Date(value));

export function EventCard({ event, tasks }: Props) {
  const completed = tasks.filter((task) => task.completed).length;
  return (
    <Link href={{ pathname: '/events/[eventId]', params: { eventId: event.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.status}><ProgressDot progress={getTaskProgress(tasks)} /></View>
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>
            {event.allDay ? '終日' : `${time(event.startAt)}–${time(event.endAt)}`}
            {event.location ? `  ·  ${event.location}` : ''}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.badge}>{tasks.length ? `${completed}/${tasks.length} 完了` : 'タスクなし'}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: palette.surface, borderRadius: radius.sm, padding: spacing.lg, borderWidth: 1, borderColor: palette.line },
  pressed: { opacity: 0.7 },
  status: { width: 30, paddingTop: 3 },
  content: { flex: 1 },
  title: { color: palette.ink, fontSize: 16, fontWeight: '700' },
  meta: { color: palette.muted, fontSize: 13, marginTop: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  badge: { color: palette.muted, fontSize: 12, borderWidth: 1, borderColor: palette.line, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3 },
  chevron: { color: palette.muted, fontSize: 24, marginLeft: 'auto' },
});
