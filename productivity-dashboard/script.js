function openFeatures() {
  var allElems = document.querySelectorAll(".elem");
  var fullElemPage = document.querySelectorAll(".fullElem");
  var fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
    });
  });
}
openFeatures();

function todoList() {
  var currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  }

  function renderTask() {
    var allTask = document.querySelector(".allTask");
    var sum = "";

    currentTask.forEach(function (elem, idx) {
      sum += `
    <div class="task">
      <div>
        <h5>${elem.task} <span class="${elem.imp}">imp</span></h5>
        <p style="color:#381c0a; font-size:18px; margin-top:5px;">
          ${elem.details || ""}
        </p>
      </div>
      <button id="${idx}">Mark as Completed</button>
    </div>`;
    });

    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }

  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector("#task-input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector("#check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (taskInput.value.trim() === "") return;

    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });

    renderTask();

    taskCheckbox.checked = false;
    taskInput.value = "";
    taskDetailsInput.value = "";
  });
}
todoList();

function dailyPlanner() {
  var dayPlanner = document.querySelector(".day-planner");
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  var wholeDaySum = "";

  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";

    wholeDaySum += `
    <div class="day-planner-time">
      <p>${elem}</p>
      <input id="${idx}" type="text" placeholder="..." value="${savedData}">
    </div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

function motivationalQuote() {
  var motivationQuoteContent = document.querySelector(".motivation-2 h1");
  var motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    try {
      let response = await fetch("https://api.quotable.io/random");
      let data = await response.json();

      motivationQuoteContent.innerHTML = data.content;
      motivationAuthor.innerHTML = data.author;
    } catch (error) {
      motivationQuoteContent.innerHTML = "Stay motivated!";
      motivationAuthor.innerHTML = "";
    }
  }

  fetchQuote();
}
motivationalQuote();

function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  var startBtn = document.querySelector(".start-timer");
  var pauseBtn = document.querySelector(".pause-timer");
  var resetBtn = document.querySelector(".reset-timer");
  var session = document.querySelector(".session");

  var isWorkSession = true;
  let totalSeconds = 25 * 60;
  let timerInterval = null;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(function () {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        clearInterval(timerInterval);

        if (isWorkSession) {
          totalSeconds = 5 * 60;
          session.innerHTML = "Take a Break";
          session.style.backgroundColor = "var(--blue)";
        } else {
          totalSeconds = 25 * 60;
          session.innerHTML = "Work Session";
          session.style.backgroundColor = "var(--green)";
        }

        isWorkSession = !isWorkSession;
        updateTimer();
      }
    }, 1000); // 🔥 fixed (was 10)
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    totalSeconds = 25 * 60;
    isWorkSession = true;
    session.innerHTML = "Work Session";
    session.style.backgroundColor = "var(--green)";
    updateTimer();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  updateTimer();
}
pomodoroTimer();

function weatherFunctionality() {
  var city = "Kolkata"; // changed

  var header1Time = document.querySelector(".header1 h1");
  var header1Date = document.querySelector(".header1 h2");
  var header2Temp = document.querySelector(".header2 h2");
  var header2Condition = document.querySelector(".header2 h4");
  var humidity = document.querySelector(".header2 .humidity");
  var wind = document.querySelector(".header2 .wind");

  const API_KEY = "aa78a9a490f4446fa61150640261601";

  async function weatherAPICall() {
    try {
      var response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`,
      );

      if (!response.ok) throw new Error("API Error");

      var data = await response.json();

      header2Temp.innerHTML = `${data.current.temp_c}°C`;
      header2Condition.innerHTML = `${data.current.condition.text}`;
      wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
      humidity.innerHTML = `Humidity: ${data.current.humidity}%`;

      document.querySelector(".header1 h4").innerHTML =
        `${data.location.name}, ${data.location.region}`;
    } catch (error) {
      console.log("Weather Error:", error);
    }
  }

  weatherAPICall();

  function timeDate() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var date = new Date();

    var day = days[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var tarik = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();

    header1Date.innerHTML = `${tarik} ${month}, ${year}`;

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    header1Time.innerHTML = `${day}, ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;
  }

  setInterval(timeDate, 1000);
}
weatherFunctionality();

function changeTheme() {
  var theme = document.querySelector(".theme");
  var root = document.documentElement;
  var flag = 0;

  theme.addEventListener("click", function () {
    if (flag === 0) {
      root.style.setProperty("--pri", "#F8F4E1");
      root.style.setProperty("--sec", "#222831");
      root.style.setProperty("--tri1", "#948979");
      root.style.setProperty("--tri2", "#393E46");
      flag = 1;
    } else if (flag === 1) {
      root.style.setProperty("--pri", "#F1EFEC");
      root.style.setProperty("--sec", "#030303");
      root.style.setProperty("--tri1", "#D4C9BE");
      root.style.setProperty("--tri2", "#123458");
      flag = 2;
    } else {
      root.style.setProperty("--pri", "#F8F4E1");
      root.style.setProperty("--sec", "#381c0a");
      root.style.setProperty("--tri1", "#FEBA17");
      root.style.setProperty("--tri2", "#74512D");
      flag = 0;
    }
  });
}
changeTheme();
