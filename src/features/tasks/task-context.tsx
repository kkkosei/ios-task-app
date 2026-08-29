import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Task } from './task';

const STORAGE_KEY = 'calendar-linked-tasks-v1';
type TaskContextValue = {
  tasks: Task[];
  addTask: (eventId: string, title: string) => void;
  toggleTask: (taskId: string) => void;
};
const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) setTasks(JSON.parse(value) as Task[]);
      hydrated.current = true;
    });
  }, []);

  useEffect(() => {
    if (hydrated.current) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const value = useMemo<TaskContextValue>(() => ({
    tasks,
    addTask: (eventId, title) => {
      const normalizedTitle = title.trim();
      if (!normalizedTitle) return;
      setTasks((current) => [...current, {
        id: `${eventId}-${Date.now()}`,
        eventId,
        title: normalizedTitle,
        completed: false,
      }]);
    },
    toggleTask: (taskId) => setTasks((current) => current.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task)),
  }), [tasks]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used inside TaskProvider');
  return context;
}
