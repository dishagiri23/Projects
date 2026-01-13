const addBtn = document.getElementById("addBtn");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("task-list");

// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* -------------------------
   Save tasks to localStorage
-------------------------- */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* -------------------------
   Add task to array
-------------------------- */
function addTask(task) {
  tasks.push(task);
  saveTasks();
}

/* -------------------------
   Delete task from array
-------------------------- */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
}

/* -------------------------
   Clear all tasks (optional)
-------------------------- */
function clearTasks() {
  localStorage.removeItem("tasks");
  tasks = [];
  taskList.innerHTML = "";
}

/* -------------------------
   Render tasks on UI
-------------------------- */
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const taskRow = document.createElement("div");
    taskRow.className = "task-item";

    taskRow.innerHTML = `
      <p class="task-text">${task.text}</p>
      <span class="delete">✕</span>
    `;

    // delete button
    taskRow.querySelector(".delete").addEventListener("click", () => {
      deleteTask(task.id);
      renderTasks();
    });

    taskList.appendChild(taskRow);
  });
}

/* -------------------------
   Add button click
-------------------------- */
addBtn.addEventListener("click", () => {
  const value = input.value.trim();
  if (value === "") return;

  const task = {
    id: Date.now(),   // unique id
    text: value
  };

  addTask(task);
  renderTasks();

  input.value = "";
});

/* -------------------------
   Load tasks on page refresh
-------------------------- */
renderTasks();


const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const openIcon = document.querySelector('.open-icon');
const closeIcon = document.querySelector('.close-icon');
const dateList = document.getElementById('dateList');

// Function to get today's date as YYYY-MM-DD
function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Initialize data in localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || {};

// Function to render dates in the sidebar
function renderDates() {
  dateList.innerHTML = ''; // Clear the current list
  Object.keys(todos).sort().forEach(date => {
    const li = document.createElement('li');
    li.textContent = date;

    // Highlight the date if it has tasks
    if (todos[date].length > 0) {
      li.classList.add('has-todo');
    }

    // Add event listener to show tasks for the clicked date
    li.addEventListener('click', () => {
      // Trigger the click on the date and show the tasks
      selectedDate = date;
      renderTodos(); // Function that would render the tasks (you can define it as needed)
    });

    dateList.appendChild(li); // Add the date to the sidebar list
  });
}

// Function to toggle sidebar (collapse/expand)
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');

  // Toggle between open and close icons
  if (sidebar.classList.contains('collapsed')) {
    openIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  } else {
    openIcon.style.display = 'none';
    closeIcon.style.display = 'block';
  }
});

// Initialize rendering of dates
renderDates();



