// Input validation belongs here so app.js can focus on coordinating the UI.
export function validateTaskTitle(title) {
  const cleanedTitle = title.trim();

  if (cleanedTitle.length === 0) {
    return { valid: false, message: "Please enter a task name." };
  }

  if (cleanedTitle.length > 120) {
    return { valid: false, message: "Task names must be 120 characters or fewer." };
  }

  return { valid: true, message: "", value: cleanedTitle };
}
