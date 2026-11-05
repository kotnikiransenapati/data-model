export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export function addTask(tasks: Task[], title: string): Task[] {
  const usedIds = new Set(tasks.map((task) => task.id));
  const maximumId = tasks.reduce((maximum, task) => Math.max(maximum, task.id), 0);
  let id = maximumId + 1;

  if (!Number.isSafeInteger(id) || usedIds.has(id)) {
    id = 1;
    while (usedIds.has(id)) {
      id += 1;
    }
  }

  return [...tasks, { id, title, status: "todo" }];
}

export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, status: "done" } : task,
  );
}

export function advanceTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    return {
      ...task,
      status: task.status === "todo" ? "in-progress" : "done",
    };
  });
}

export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}

export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return tasks.filter((task) => task.status === status).length;
}
