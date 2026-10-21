import { createTask, updateTask, deleteTask, toggleTask } from "./task.js";
import { loadTasks, saveTasks } from "./storage.js";
import { validateTaskTitle } from "./validation.js";

const API_URL = "http://localhost:3000/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const categoryInput = document.getElementById("categoryInput");
const deadlineInput = document.getElementById("deadlineInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const formMessage = document.getElementById("formMessage");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const visibleCount = document.getElementById("visibleCount");

const exportBtn =
  document.getElementById("exportBtn");


let tasks = [];
async function fetchTasks() {
  const response = await fetch(API_URL);
  tasks = await response.json();
  renderTasks();
}

function persistTasks() {
  const saved = saveTasks(tasks);
  if (!saved) {
    formMessage.textContent = "Your change is visible, but could not be saved in this browser.";
  }
}

function renderTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;

  const visibleTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);

    return matchesSearch && matchesFilter;
  });

  taskList.replaceChildren();

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";
    const today = new Date().toISOString().split("T")[0];

if (
  task.deadline &&
  task.deadline < today &&
  !task.completed
) {
  item.classList.add("overdue");
}

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} completed`);
    checkbox.addEventListener("change", () => {
      tasks = toggleTask(tasks, task.id);
      persistTasks();
      renderTasks();
    });

    const main = document.createElement("div");
    main.className = "task-main";

    const title = document.createElement("div");
    title.className = `task-title${task.completed ? " done" : ""}`;
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const priority = document.createElement("span");
    priority.className = `priority ${task.priority}`;
    priority.textContent = `${task.priority} priority`;

    const category = document.createElement("span");
    category.textContent = `Category: ${task.category}`;

  const deadline = document.createElement("span");
  deadline.className = "deadline";

  if (
    task.deadline &&
    task.deadline < today &&
    !task.completed
  ) {
    deadline.textContent = `⚠️ Overdue (${task.deadline})`;
  } else {
    deadline.textContent = task.deadline
      ? `📅 ${task.deadline}`
      : "📅 No deadline";
  }

    const status = document.createElement("span");
    status.textContent = task.completed ? "Completed" : "Pending";

    meta.append(priority, category, deadline, status);
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "secondary";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      const newTitle = window.prompt("Edit task name:", task.title);
      if (newTitle === null) return;

      const result = validateTaskTitle(newTitle);
      if (!result.valid) {
        formMessage.textContent = result.message;
        return;
      }

      const newPriority = window.prompt("Priority: low, medium, or high", task.priority);
      if (newPriority === null) return;
      const cleanedPriority = newPriority.trim().toLowerCase();
      if (!["low", "medium", "high"].includes(cleanedPriority)) {
        formMessage.textContent = "Priority must be low, medium, or high.";
        return;
      }

      tasks = updateTask(tasks, task.id, {
        title: result.value,
        priority: cleanedPriority
      });
      formMessage.textContent = "";
      persistTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const confirmed = window.confirm(`Delete "${task.title}"?`);
      if (!confirmed) return;
      tasks = deleteTask(tasks, task.id);
      persistTasks();
      renderTasks();
    });

    actions.append(editButton, deleteButton);
    item.append(checkbox, main, actions);
    taskList.append(item);
  });

  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(task => task.completed).length;
  pendingCount.textContent = tasks.filter(task => !task.completed).length;
  visibleCount.textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;
  emptyState.hidden = visibleTasks.length > 0;
  if (visibleTasks.length === 0) {
    emptyState.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above."
      : "No tasks match your search or filter.";
  }
}

taskForm.addEventListener("submit", async event => {
  event.preventDefault();

  const result = validateTaskTitle(taskInput.value);
  if (!result.valid) {
    formMessage.textContent = result.message;
    taskInput.focus();
    return;
  }

 const task = createTask(
  result.value,
  priorityInput.value,
  categoryInput.value,
  deadlineInput.value
);
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });

  await fetchTasks();

  taskInput.value = "";
  priorityInput.value = "medium";
  deadlineInput.value = "";
  formMessage.textContent = "";
  renderTasks();
  taskInput.focus();
});

searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);


const themeToggle = document.getElementById("themeToggle");

// Restore the saved theme when the page loads.
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️ Light mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDarkMode
    ? "☀️ Light mode"
    : "🌙 Dark mode";

  localStorage.setItem("theme", isDarkMode ? "dark" : "light");

});

exportBtn.addEventListener("click", () => {

  const jsonData = JSON.stringify(tasks, null, 2);

  const blob = new Blob(
    [jsonData],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "tasks.json";

  link.click();

  URL.revokeObjectURL(url);

});
fetchTasks();