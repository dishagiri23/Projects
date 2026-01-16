const main = document.querySelector("main");
const button = document.querySelector("button");
const card = document.querySelector("#card");
const input = document.querySelector("input");


button.addEventListener("click", function (event) {
  event.preventDefault();

  if (input.value == "") {
    alert("Please enter a city name!");
  } else {
    card.style.opacity = "1";
  }
});
