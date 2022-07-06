const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const desElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const dateElement = document.querySelector(".date");
const inputWeatherButton = document.querySelector("#input-button");

const currentWeatherButton = document.querySelector("#current-button");
const cityInput = document.querySelector("#city-input");

const weather = {};
weather.temperature = {
  unit: "celsius",
};

let geolocation = false;

const KELVIN = 273;
const KEY = "82005d27a116c2880c8f0fcb866998a0";
today = new Date();
dateElement.innerHTML = `<p>${today.toDateString()}</p>`;

function checkWeather() {
  if (!geolocation) {
    getWeather(null, null);
  } else {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
      notificationElement.style.display = "block";
      notificationElement.innerHTML =
        "<p>Browser doesn't Support Geolocation</p>";
    }
  }
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

// Show error

function showError(error) {
  notificationElement.style.display = "block";
  if (error.message != null) {
    notificationElement.innerHTML = `<p>${error.message}</p>`;
  } else {
    notificationElement.innerHTML = `<p>${error}</p>`;
  }
}

// GET Weather from API

function getWeather(latitude, longitude) {
  let city = cityInput.value;

  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`;
  if (geolocation) {
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;
  }
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      if (data.cod == 200) {
        notificationElement.style.display = "";
        weather.temperature.value = data.main.temp;
        weather.description = data.weather[0].description;
        weather.iconID = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        displayWeather();
      } else {
        showError("Invalid Location");
      }
    });
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
  tempElement.innerHTML = `${Math.floor(
    weather.temperature.value - KELVIN
  )}° <span>C</span>`;
  desElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function cToF() {
  const fah = ((weather.temperature.value - KELVIN) * 9) / 5 + 32;
  tempElement.innerHTML = `${Math.floor(fah)}° <span>F</span>`;
}

inputWeatherButton.addEventListener("click", function () {
  geolocation = false;
  checkWeather();
});

currentWeatherButton.addEventListener("click", function () {
  geolocation = true;
  checkWeather();
});
