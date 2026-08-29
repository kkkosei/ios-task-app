import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getTaskProgress } from '@/features/tasks/task';
import { useTasks } from '@/features/tasks/task-context';
import { palette, radius, spacing } from '@/shared/theme/tokens';
import { useCalendarEvents } from '../calendar-context';
import { ProgressDot } from '../components/progress-dot';

const formatTime = (value: string) => new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function EventTasksScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { events } = useCalendarEvents();
  const { tasks, addTask, toggleTask } = useTasks();
  const [title, setTitle] = useState('');
  const event = events.find((item) => item.id === eventId);
  const eventTasks = tasks.filter((task) => task.eventId === eventId);

  if (!event) return <View style={styles.center}><Text style={styles.emptyTitle}>予定が見つかりません</Text></View>;
  const completed = eventTasks.filter((task) => task.completed).length;
  const submit = () => { addTask(event.id, title); setTitle(''); };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.eventHeader}>
        <View style={styles.statusRow}><ProgressDot progress={getTaskProgress(eventTasks)} /><Text style={styles.statusText}>{completed}/{eventTasks.length} 完了</Text></View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventMeta}>{event.allDay ? '終日' : `${formatTime(event.startAt)}–${formatTime(event.endAt)}`}{event.location ? `  ·  ${event.location}` : ''}</Text>
      </View>
      <Text style={styles.sectionTitle}>関連タスク</Text>
      <View style={styles.taskList}>
        {eventTasks.length === 0 ? <Text style={styles.emptyText}>まだタスクはありません。</Text> : eventTasks.map((task) => (
          <Pressable key={task.id} onPress={() => toggleTask(task.id)} style={styles.taskRow}>
            <View style={[styles.checkbox, task.completed && styles.checkboxComplete]}>{task.completed && <Text style={styles.checkmark}>✓</Text>}</View>
            <Text style={[styles.taskTitle, task.completed && styles.taskTitleComplete]}>{task.title}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.addRow}>
        <TextInput onChangeText={setTitle} onSubmitEditing={submit} placeholder="タスクを追加" placeholderTextColor={palette.empty} returnKeyType="done" style={styles.input} value={title} />
        <Pressable disabled={!title.trim()} onPress={submit} style={({ pressed }) => [styles.addButton, (!title.trim() || pressed) && styles.disabled]}><Text style={styles.addButtonText}>追加</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  content: { padding: spacing.xl, paddingBottom: 48, width: '100%', maxWidth: 720, alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.canvas },
  eventHeader: { backgroundColor: palette.surface, borderRadius: radius.sm, padding: spacing.xl, borderWidth: 1, borderColor: palette.line },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusText: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  eventTitle: { color: palette.ink, fontSize: 25, fontWeight: '800', marginTop: spacing.lg },
  eventMeta: { color: palette.muted, fontSize: 14, marginTop: spacing.sm },
  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '800', marginTop: spacing.xl, marginBottom: spacing.md },
  taskList: { backgroundColor: palette.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: palette.line, overflow: 'hidden' },
  taskRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.line },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: palette.empty, alignItems: 'center', justifyContent: 'center' },
  checkboxComplete: { backgroundColor: palette.complete, borderColor: palette.complete },
  checkmark: { color: '#fff', fontWeight: '800' },
  taskTitle: { flex: 1, color: palette.ink, fontSize: 15 },
  taskTitleComplete: { color: palette.muted, textDecorationLine: 'line-through' },
  emptyText: { color: palette.muted, padding: spacing.lg },
  emptyTitle: { color: palette.ink, fontSize: 18, fontWeight: '700' },
  addRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  input: { flex: 1, height: 48, backgroundColor: palette.surface, color: palette.ink, borderWidth: 1, borderColor: palette.line, borderRadius: radius.sm, paddingHorizontal: spacing.lg, fontSize: 15 },
  addButton: { height: 48, justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: palette.accent, borderRadius: radius.sm },
  disabled: { opacity: 0.45 },
  addButtonText: { color: '#fff', fontWeight: '700' },
});
