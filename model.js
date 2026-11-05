export function addTask(tasks, title) {
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
export function completeTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}
export function advanceTask(tasks, id) {
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
export function filterByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}
export function countByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status).length;
}
