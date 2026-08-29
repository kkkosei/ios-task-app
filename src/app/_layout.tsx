import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { CalendarProvider } from '@/features/calendar/calendar-context';
import { TaskProvider } from '@/features/tasks/task-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CalendarProvider>
        <TaskProvider>
          <Stack screenOptions={{ headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="events/[eventId]" options={{ title: '予定のタスク' }} />
          </Stack>
        </TaskProvider>
      </CalendarProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
