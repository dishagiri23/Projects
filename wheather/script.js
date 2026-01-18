const main = document.querySelector("main");
const form = document.querySelector("form");
const button = document.querySelector("button");
const card = document.querySelector("#card");
const input = document.querySelector("input");
const para = document.querySelector("p");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const API_KEY = "aa78a9a490f4446fa61150640261601";

async function getWeather(city) {
  try {
    // Show loading message
    para.innerText = "Loading weather data...";
    para.style.display = "block";
    card.style.opacity = "0";

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`,
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    // Update weather card with API data
    cityName.textContent = data.location.name;
    temperature.textContent = `${data.current.temp_c}°C`;
    humidity.textContent = `${data.current.humidity}%`;
    wind.textContent = `${data.current.wind_kph} km/h`;

    const weatherText = data.current.condition.text;

    // Use API's icon directly
    weatherIcon.src =
      "https:" + data.current.condition.icon + "?v=" + new Date().getTime(); // force reload
    weatherIcon.alt = weatherText;
    description.textContent = weatherText;

    // Show card
    card.style.opacity = "1";
    button.style.backgroundColor = "#2aa8ff";
    para.style.display = "none";
  } catch (error) {
    para.style.display = "none";
    alert(error.message);
  }
}

// Button click event
button.addEventListener("click", function (event) {
  event.preventDefault();

  const city = input.value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  getWeather(city);
});

// Form submit event (Enter key)
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = input.value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  getWeather(city);
});
