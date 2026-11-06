const STORAGE_KEY = "taskflow_tasks";

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const title = taskInput.value.trim();
  if (!title) {
    formMessage.textContent = "Please enter a task before adding.";
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  });

  taskInput.value = "";
  formMessage.textContent = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

function editTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  const updatedTitle = prompt("Edit your task:", task.title);
  if (updatedTitle === null) return;

  const cleanedTitle = updatedTitle.trim();
  if (!cleanedTitle) {
    alert("Task cannot be empty.");
    return;
  }

  task.title = cleanedTitle;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  tasks = tasks.filter(item => item.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const title = document.createElement("span");
    title.className = "task-text";
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "icon-button";
    editButton.textContent = "✎";
    editButton.title = "Edit task";
    editButton.setAttribute("aria-label", `Edit ${task.title}`);
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-button delete";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    item.append(checkbox, title, actions);
    taskList.appendChild(item);
  });

  emptyState.hidden = visibleTasks.length !== 0;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("activeCount").textContent = tasks.filter(task => !task.completed).length;
  document.getElementById("completedCount").textContent = tasks.filter(task => task.completed).length;
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") addTask();
});
taskInput.addEventListener("input", () => {
  if (taskInput.value.trim()) formMessage.textContent = "";
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

const now = new Date();
document.getElementById("dayName").textContent = now.toLocaleDateString(undefined, { weekday: "long" });
document.getElementById("todayDate").textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

renderTasks();
