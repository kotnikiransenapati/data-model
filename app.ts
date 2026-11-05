import {
  addTask,
  advanceTask,
  countByStatus,
  filterByStatus,
  type Task,
  type TaskStatus,
} from "./model.js";

type TaskFilter = TaskStatus | "all";

const taskForm = document.getElementById("task-form") as HTMLFormElement;
const taskInput = document.getElementById("task-title") as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;
const taskCount = document.getElementById("task-count") as HTMLSpanElement;
const todoCount = document.getElementById("todo-count") as HTMLSpanElement;
const progressCount = document.getElementById("progress-count") as HTMLSpanElement;
const doneCount = document.getElementById("done-count") as HTMLSpanElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

let tasks: Task[] = [];
let activeFilter: TaskFilter = "all";

function parseFilter(value: string | undefined): TaskFilter | null {
  switch (value) {
    case "all":
    case "todo":
    case "in-progress":
    case "done":
      return value;
    default:
      return null;
  }
}

function updateCounts(): void {
  taskCount.textContent = String(tasks.length);
  todoCount.textContent = String(countByStatus(tasks, "todo"));
  progressCount.textContent = String(countByStatus(tasks, "in-progress"));
  doneCount.textContent = String(countByStatus(tasks, "done"));
}

function createTaskRow(task: Task): HTMLLIElement {
  const row = document.createElement("li");
  row.className = `task-row status-${task.status}`;
  row.dataset.taskId = String(task.id);

  const dot = document.createElement("span");
  dot.className = "task-dot";
  dot.setAttribute("aria-hidden", "true");

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const status = document.createElement("span");
  status.className = "status-badge";
  status.tabIndex = -1;
  status.textContent =
    task.status === "todo"
      ? "To start"
      : task.status === "in-progress"
        ? "In motion"
        : "Done";

  const actionLabel =
    task.status === "todo"
      ? "Start"
      : task.status === "in-progress"
        ? "Finish"
        : "Completed";
  const action = document.createElement("button");
  action.className = "advance-button";
  action.type = "button";
  action.textContent = actionLabel;
  action.disabled = task.status === "done";
  action.setAttribute("aria-label", `${actionLabel} task: ${task.title}`);
  action.addEventListener("click", () => {
    tasks = advanceTask(tasks, task.id);
    render();

    const updatedAction = taskList.querySelector<HTMLButtonElement>(
      `[data-task-id="${task.id}"] .advance-button`,
    );
    if (updatedAction !== null && !updatedAction.disabled) {
      updatedAction.focus();
      return;
    }

    const updatedStatus = taskList.querySelector<HTMLElement>(
      `[data-task-id="${task.id}"] .status-badge`,
    );
    if (updatedStatus !== null) {
      updatedStatus.focus();
      return;
    }

    const activeFilterButton = Array.from(filterButtons).find(
      (button) => parseFilter(button.dataset.filter) === activeFilter,
    );
    activeFilterButton?.focus();
  });

  row.append(dot, title, status, action);
  return row;
}

function render(): void {
  const visibleTasks =
    activeFilter === "all" ? tasks : filterByStatus(tasks, activeFilter);

  taskList.replaceChildren();
  if (visibleTasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent =
      tasks.length === 0
        ? "Your list is clear. Add one small step to get started."
        : "Nothing in this view just yet.";
    taskList.append(emptyState);
  } else {
    visibleTasks.forEach((task) => taskList.append(createTaskRow(task)));
  }

  filterButtons.forEach((button) => {
    const filter = parseFilter(button.dataset.filter);
    if (filter !== null) {
      button.setAttribute("aria-pressed", String(filter === activeFilter));
    }
  });

  updateCounts();
}

taskForm.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (title.length === 0) {
    taskInput.focus();
    return;
  }

  tasks = addTask(tasks, title);
  taskInput.value = "";
  activeFilter = "all";
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = parseFilter(button.dataset.filter);
    if (filter !== null) {
      activeFilter = filter;
      render();
    }
  });
});

render();
