import { addTask, completeTask, countByStatus, filterByStatus, type Task } from "./model.js";

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const tasks: Task[] = [
  { id: 2, title: "Existing task", status: "todo" },
  { id: 7, title: "Finished task", status: "done" },
];

const added = addTask(tasks, "New task");
assert(added.length === 3, "addTask should append one task");
assert(added[2]?.id === 8, "addTask should use a unique next ID");
assert(added[2]?.title === "New task" && added[2]?.status === "todo", "addTask should initialize the task");
assert(tasks.length === 2, "addTask should not mutate the input array");

const completed = completeTask(tasks, 2);
assert(completed[0]?.status === "done", "completeTask should mark the matching task done");
assert(tasks[0]?.status === "todo", "completeTask should not mutate the input task");

const todoTasks = filterByStatus(tasks, "todo");
assert(todoTasks.length === 1 && todoTasks[0]?.id === 2, "filterByStatus should return matching tasks");
assert(countByStatus(tasks, "done") === 1, "countByStatus should count matching tasks");

console.log("Model tests passed.");
