/***********************
  DOM ELEMENTS
************************/
const containers = document.querySelectorAll(
  "#container1, #container2, #container3, #container4, #container5",
);

const generateBtn = document.getElementById("generate");
const backwardBtn = document.getElementById("backward");
const typeButtons = document.querySelectorAll(".type");

/***********************
  GLOBAL STATE
************************/
let currentType = "HEX";
let history = [];
let historyIndex = -1;

/***********************
  BACKWARD INITIAL STATE
************************/
disableBackward();

/***********************
  LOCK / UNLOCK
************************/
containers.forEach((container) => {
  const openLock = container.querySelector(".open-lock");
  const closeLock = container.querySelector(".icon3");

  openLock.addEventListener("click", () => {
    container.classList.add("locked");
  });

  closeLock.addEventListener("click", () => {
    container.classList.remove("locked");
  });
});

/***********************
  COLOR TYPE SWITCH
************************/
typeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentType = btn.innerText;

    typeButtons.forEach((b) => (b.style.backgroundColor = "#18231c"));
    btn.style.backgroundColor = "#7C3BED";

    updateAllContainers();
  });
});

/***********************
  RANDOM HSL
************************/
function randomHSL() {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 40) + 60,
    l: Math.floor(Math.random() * 30) + 40,
  };
}

/***********************
  HSL → RGB → HEX
************************/
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));

  return { r: f(0), g: f(8), b: f(4) };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/***********************
  COLOR VALUE TEXT
************************/
function getColorValue(hsl) {
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  if (currentType === "HEX") return hex;
  if (currentType === "RGB") return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/***********************
  EXACT COLOR NAMES (HUE)
************************/
function getColorName(h) {
  if (h < 15) return "RED";
  if (h < 45) return "ORANGE";
  if (h < 70) return "YELLOW";
  if (h < 160) return "GREEN";
  if (h < 200) return "CYAN";
  if (h < 260) return "BLUE";
  if (h < 300) return "PURPLE";
  return "PINK";
}

/***********************
  APPLY COLOR
************************/
function applyColor(container, hsl) {
  container.style.backgroundColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  container.querySelector("h1").innerText = getColorValue(hsl);
  container.querySelector("p").innerText = getColorName(hsl.h);
}

/***********************
  UPDATE ALL
************************/
function updateAllContainers() {
  containers.forEach((container) => {
    if (container._color) applyColor(container, container._color);
  });
}

/***********************
  HISTORY SAVE
************************/
function saveState() {
  const state = [];

  containers.forEach((container) => {
    state.push({
      color: container._color,
      locked: container.classList.contains("locked"),
    });
  });

  history = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;

  enableBackward();
}

/***********************
  RESTORE STATE
************************/
function restoreState(index) {
  const state = history[index];

  containers.forEach((container, i) => {
    container._color = state[i].color;

    container.classList.toggle("locked", state[i].locked);
    applyColor(container, container._color);
  });

  historyIndex <= 0 ? disableBackward() : enableBackward();
}

/***********************
  GENERATE
************************/
generateBtn.addEventListener("click", () => {
  saveState();

  containers.forEach((container) => {
    if (container.classList.contains("locked")) return;

    const hsl = randomHSL();
    container._color = hsl;
    applyColor(container, hsl);
  });
});

/***********************
  BACKWARD (UNDO)
************************/
backwardBtn.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--;
    restoreState(historyIndex);
  }
});

/***********************
  BACKWARD UI CONTROL
************************/
function enableBackward() {
  backwardBtn.disabled = false;
  backwardBtn.classList.add("active");
  backwardBtn.style.cursor = "pointer";
}

function disableBackward() {
  backwardBtn.disabled = true;
  backwardBtn.classList.remove("active");
  backwardBtn.style.cursor = "not-allowed";
}

/***********************
  INITIAL LOAD
************************/
window.addEventListener("DOMContentLoaded", () => {
  containers.forEach((container) => {
    const hsl = randomHSL();
    container._color = hsl;
    applyColor(container, hsl);
  });

  history = [];
  historyIndex = -1;
  disableBackward();
});
