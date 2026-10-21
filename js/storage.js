const STORAGE_KEY = "nexus-task-manager-tasks";

// Load saved tasks. Invalid or unavailable data safely falls back to an empty array.
export function loadTasks() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (savedValue === null) return [];

    const parsedValue = JSON.parse(savedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error("Could not load tasks:", error);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Could not save tasks:", error);
    return false;
  }
}
