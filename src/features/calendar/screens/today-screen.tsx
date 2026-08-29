import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/features/tasks/task-context';
import { palette, spacing } from '@/shared/theme/tokens';
import { useCalendarEvents } from '../calendar-context';
import { EventCard } from '../components/event-card';

export function TodayScreen() {
  const { tasks } = useTasks();
  const { events, loading, permission, error, connect, refresh } = useCalendarEvents();
  const completed = tasks.filter((task) => task.completed).length;
  const date = new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading && permission === 'granted'} onRefresh={refresh} />}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{date}</Text>
          <Text style={styles.heading}>今日の予定</Text>
          <Text style={styles.summary}>{events.length}件の予定 · {completed}/{tasks.length}件のタスクが完了</Text>
        </View>

        {permission !== 'granted' ? (
          <View style={styles.connectCard}>
            <Text style={styles.connectTitle}>iOSカレンダーと同期</Text>
            <Text style={styles.connectText}>今日の予定を読み込み、それぞれの予定にタスクを追加できます。</Text>
            {permission === 'unavailable' ? (
              <Text style={styles.hint}>カレンダー同期はiOSまたはAndroidのdevelopment buildで利用できます。</Text>
            ) : (
              <Pressable onPress={() => void connect()} style={styles.button}><Text style={styles.buttonText}>カレンダーを接続</Text></Pressable>
            )}
          </View>
        ) : loading && events.length === 0 ? (
          <ActivityIndicator color={palette.accent} />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : events.length === 0 ? (
          <Text style={styles.message}>今日の予定はありません。</Text>
        ) : (
          <View style={styles.list}>{events.map((event) => <EventCard key={event.id} event={event} tasks={tasks.filter((task) => task.eventId === event.id)} />)}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.canvas },
  content: { padding: spacing.xl, paddingBottom: 48, width: '100%', maxWidth: 720, alignSelf: 'center' },
  header: { marginTop: spacing.md, marginBottom: spacing.xl },
  eyebrow: { color: palette.accent, fontSize: 13, fontWeight: '700' },
  heading: { color: palette.ink, fontSize: 34, fontWeight: '800', marginTop: spacing.xs },
  summary: { color: palette.muted, fontSize: 14, marginTop: spacing.sm },
  list: { gap: spacing.md },
  connectCard: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, borderRadius: 12, padding: spacing.xl },
  connectTitle: { color: palette.ink, fontSize: 18, fontWeight: '800' },
  connectText: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  hint: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: spacing.lg },
  button: { alignSelf: 'flex-start', backgroundColor: palette.accent, borderRadius: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginTop: spacing.lg },
  buttonText: { color: '#fff', fontWeight: '700' },
  message: { color: palette.muted, textAlign: 'center', paddingVertical: spacing.xxl },
});
