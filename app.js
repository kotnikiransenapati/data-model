import { addTask, advanceTask, countByStatus, filterByStatus, } from "./model.js";
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-title");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const todoCount = document.getElementById("todo-count");
const progressCount = document.getElementById("progress-count");
const doneCount = document.getElementById("done-count");
const filterButtons = document.querySelectorAll("[data-filter]");
let tasks = [];
let activeFilter = "all";
function parseFilter(value) {
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
function updateCounts() {
    taskCount.textContent = String(tasks.length);
    todoCount.textContent = String(countByStatus(tasks, "todo"));
    progressCount.textContent = String(countByStatus(tasks, "in-progress"));
    doneCount.textContent = String(countByStatus(tasks, "done"));
}
function createTaskRow(task) {
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
    const actionLabel = task.status === "todo"
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
        const updatedAction = taskList.querySelector(`[data-task-id="${task.id}"] .advance-button`);
        if (updatedAction !== null && !updatedAction.disabled) {
            updatedAction.focus();
            return;
        }
        const updatedStatus = taskList.querySelector(`[data-task-id="${task.id}"] .status-badge`);
        if (updatedStatus !== null) {
            updatedStatus.focus();
            return;
        }
        const activeFilterButton = Array.from(filterButtons).find((button) => parseFilter(button.dataset.filter) === activeFilter);
        activeFilterButton?.focus();
    });
    row.append(dot, title, status, action);
    return row;
}
function render() {
    const visibleTasks = activeFilter === "all" ? tasks : filterByStatus(tasks, activeFilter);
    taskList.replaceChildren();
    if (visibleTasks.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.textContent =
            tasks.length === 0
                ? "Your list is clear. Add one small step to get started."
                : "Nothing in this view just yet.";
        taskList.append(emptyState);
    }
    else {
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
taskForm.addEventListener("submit", (event) => {
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
