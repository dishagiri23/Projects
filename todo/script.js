const addBtn = document.getElementById("addBtn");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("task-list");

addBtn.addEventListener("click", () => {
  if (input.value.trim() === "") return;

  const taskRow = document.createElement("div");
  taskRow.className = "task-item";

  taskRow.innerHTML = `
    <p class="task-text">${input.value}</p>
    <span class="delete">✕</span>
  `;

  taskList.appendChild(taskRow);

  input.value = "";

  taskRow.querySelector(".delete").addEventListener("click", () => {
    taskRow.remove();
  });
});
