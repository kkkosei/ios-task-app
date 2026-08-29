export type Task = {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
};

export type TaskProgress = 'empty' | 'blocked' | 'partial' | 'complete';

export function getTaskProgress(tasks: Task[]): TaskProgress {
  if (tasks.length === 0) return 'empty';

  const completedCount = tasks.filter((task) => task.completed).length;
  if (completedCount === 0) return 'blocked';
  if (completedCount === tasks.length) return 'complete';
  return 'partial';
}
