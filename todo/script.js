const addBtn = document.getElementById("addBtn");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("task-list");
const dateList = document.getElementById("dateList");

// Get today's date as YYYY-MM-DD format
function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

// Initialize tasks in localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || {};

// Function to add a task for a specific date
function addTaskForDate(task, date) {
  if (!todos[date]) {
    todos[date] = []; // Initialize array if no tasks exist for this date
  }
  todos[date].push(task);
  localStorage.setItem("todos", JSON.stringify(todos));

  // Only render the date if it has tasks
  if (todos[date].length > 0) {
    renderDates(); // Update the sidebar with dates that have tasks
    renderTasksForDate(date); // Immediately show tasks in the card
  }
}

// Function to render tasks for a selected date
function renderTasksForDate(date) {
  taskList.innerHTML = ""; // Clear current tasks

  // Render tasks for the selected date
  if (todos[date] && todos[date].length > 0) {
    todos[date].forEach((task) => {
      const taskRow = document.createElement("div");
      taskRow.className = "task-item";
      taskRow.innerHTML = `
        <p class="task-text">${task.text}</p>
        <span class="edit">
          <i class="ri-edit-line"></i>
        </span>
        <span class="delete">✕</span>
      `;

      // Edit icon event
      taskRow.querySelector(".edit").addEventListener("click", () => {
        editTask(date, task.id);
      });

      // Delete button event
      taskRow.querySelector(".delete").addEventListener("click", () => {
        deleteTask(date, task.id);
        renderTasksForDate(date); // Re-render the tasks for the current date
      });

      taskList.appendChild(taskRow);
    });
  } else {
    taskList.innerHTML = "<p>No tasks for this date.</p>";
  }
}

// Function to delete task from a date
function deleteTask(date, taskId) {
  todos[date] = todos[date].filter((task) => task.id !== taskId);
  localStorage.setItem("todos", JSON.stringify(todos));

  // Re-render the tasks for the current date after deletion
  renderTasksForDate(date);
}

// Function to edit a task for a specific date
function editTask(date, taskId) {
  const task = todos[date].find((task) => task.id === taskId);
  if (task) {
    const newTaskText = prompt("Edit your task:", task.text);
    if (newTaskText && newTaskText.trim() !== "") {
      task.text = newTaskText.trim(); // Update the task text
      localStorage.setItem("todos", JSON.stringify(todos)); // Save updated tasks

      renderTasksForDate(date); // Re-render tasks for the current date
    }
  }
}

// Function to render dates in the sidebar
function renderDates() {
  dateList.innerHTML = ""; // Clear current date list

  // Sort and render dates in sidebar only if they have tasks
  Object.keys(todos)
    .sort()
    .forEach((date) => {
      if (todos[date].length > 0) {
        // Only add dates that have tasks
        const li = document.createElement("li");
        li.textContent = date;

        // Add event listener to show tasks when the date is clicked
        li.addEventListener("click", () => {
          renderTasksForDate(date); // Show tasks for the selected date
        });

        dateList.appendChild(li); // Add the date to the sidebar list
      }
    });
}

// Add new task to today's date when the add button is clicked
addBtn.addEventListener("click", () => {
  const taskText = input.value.trim();

  // If input is empty, do not add the task and alert the user
  if (taskText === "") {
    alert("Please enter a valid task.");
    return;
  }

  // Create the task object only if the input is valid
  const task = {
    id: Date.now(), // Unique id for the task
    text: taskText,
  };

  const today = getToday(); // Get today's date
  addTaskForDate(task, today); // Add task to today's date

  input.value = ""; // Clear the input field
  renderDates(); // Re-render the dates in the sidebar
});

// Initialize rendering of tasks for today and sidebar dates
renderDates();


const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// refresh reset (sidebar hidden on reload)
window.addEventListener("load", () => {
  document.getElementById("sidebar").classList.add("collapsed");
});

