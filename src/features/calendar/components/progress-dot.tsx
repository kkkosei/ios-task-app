import { StyleSheet, View } from 'react-native';

import { TaskProgress } from '@/features/tasks/task';
import { palette } from '@/shared/theme/tokens';

const colors: Record<TaskProgress, string> = {
  empty: palette.empty,
  blocked: palette.blocked,
  partial: palette.partial,
  complete: palette.complete,
};

export function ProgressDot({ progress }: { progress: TaskProgress }) {
  return <View accessibilityLabel={`進捗: ${progress}`} style={[styles.dot, { backgroundColor: colors[progress] }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
