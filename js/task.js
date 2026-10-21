export function createTask(title, priority, category, deadline) {
  return {
    id: crypto.randomUUID(),
    title,
    priority,
    category,
    deadline,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

export function updateTask(tasks, taskId, changes) {
  return tasks.map(task =>
    task.id === taskId ? { ...task, ...changes } : task
  );
}

export function deleteTask(tasks, taskId) {
  return tasks.filter(task => task.id !== taskId);
}

export function toggleTask(tasks, taskId) {
  return tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
}
