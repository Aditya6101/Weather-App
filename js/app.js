//  ! API KEY
const API_KEY = "15abe8b87abbb3ba3fafdc7ee0dd5e8b";

let countryCode = "";

// ? Getting DOM Elements

const form = document.getElementById("form");
const input = document.getElementById("input");
const searchBtn = document.getElementById("search-btn");

// ? Calling Function to load weather data on page load

window.addEventListener("load", () => getWeatherDataOnLoad());

// ? Listening for submit event on the form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = input.value;
  validateSearchTerm(searchTerm);
  form.reset();
});

searchBtn.addEventListener("submit", () => {
  return true;
});

// * Validating User Input and getting weather data according to matched format

function validateSearchTerm(value) {
  if (value === "") {
    alert("😒😒😒Please Enter Valid Term😒😒😒");
    return false;
  } else {
    // ? Regex for City Name

    const expForCityName =
      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
    const regexForCity = new RegExp(expForCityName);

    // ? Regex For Zip Code

    const expForZipCode = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/;
    const regexForZipCode = new RegExp(expForZipCode);

    if (value.match(regexForZipCode) && !value.match(regexForCity)) {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${value},${countryCode}&appid=${API_KEY}`;

      getWeatherData(weatherURL);
    } else if (value.match(regexForCity) && !value.match(regexForZipCode)) {
      value.toUpperCase();
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}`;

      getWeatherData(weatherURL);
    }
  }
}

// * Function to load weather data on page load

function getWeatherDataOnLoad() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = +position.coords.latitude;
      const lon = +position.coords.longitude;

      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      getWeatherData(weatherURL);
    });
  } else {
    alert("🙁🙁🙁Sorry!!! Your Browser Doesn't Support Geolocation🙁🙁🙁");
  }
}

async function getWeatherData(URL) {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    const { lat, lon } = data.coord;
    const { temp, pressure, humidity, temp_min, temp_max } = data.main;
    const { icon } = data.weather[0];
    const { description: desc } = data.weather[0];
    const { speed } = data.wind;
    const { name: city } = data;
    const { country } = data.sys;
    countryCode = country;
    const weatherDataObj = {
      temperature: temp,
      description: desc,
      icon,
      humidity: humidity,
      minimum_temp: temp_min,
      maximum_temp: temp_max,
      wind_speed: speed,
      pressure: pressure,
      city: city,
      country: country,
    };

    // ? Calling function to display fetched Weather Data to the DOM Elements

    showWeatherData(weatherDataObj);
    const airQualityURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    // ? Calling function to get Air Quality Data

    getAirQuality(airQualityURL);
  } catch (error) {
    console.error(error);
  }
}

async function getAirQuality(URL) {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    const { aqi } = data.list[0].main;
    const { co, no, o3, pm2_5 } = data.list[0].components;

    // ? Calling function to display fetched Air Quality Data the DOM Elements

    const aqiDataObj = {
      aqi: aqi,
      co: co,
      no: no,
      o3: o3,
      pm2_5: pm2_5,
    };

    showAirQuality(aqiDataObj);
  } catch (error) {
    console.error(error);
  }
}

// * Function to Display Weather Data

function showWeatherData({
  temperature,
  description,
  icon,
  humidity,
  minimum_temp,
  maximum_temp,
  wind_speed,
  pressure,
  city,
  country,
}) {
  const tempInC = temperature - 273.15;
  const tempMinInC = maximum_temp - 273.15;
  const tempMaxInC = minimum_temp - 273.15;
  document.querySelector(
    "#weather-img"
  ).src = `http://openweathermap.org/img/w/${icon}.png`;
  document
    .querySelectorAll(".temperature")
    .forEach((el) => (el.innerText = Math.floor(tempInC)));
  document
    .querySelectorAll(".weather-desc")
    .forEach((el) => (el.innerText = description));
  document.getElementById("humidity").innerText = humidity;
  document.getElementById("wind-speed").innerText = wind_speed;
  document.getElementById("pressure").innerText = pressure;
  document.querySelectorAll(".city").forEach((el) => (el.innerHTML = city));
  document
    .querySelectorAll(".country")
    .forEach((el) => (el.innerHTML = country));
  document
    .querySelectorAll(".temp-min")
    .forEach((el) => (el.innerText = Math.floor(tempMinInC)));
  document
    .querySelectorAll(".temp-max")
    .forEach((el) => (el.innerText = Math.floor(tempMaxInC)));
}

// * Function to Display Air Quality Data

function showAirQuality({ aqi, co, no, o3, pm2_5 }) {
  document.getElementById("co").innerText = co;
  document.getElementById("no").innerText = no;
  document.getElementById("ozone").innerText = o3;
  document.getElementById("fpm").innerText = pm2_5;

  const aqiEl = document.getElementById("aqi");
  const aqiDescEl = document.getElementById("aqi-desc");

  let color = "";
  if (aqi === 5) {
    color = "red";
    aqiDescEl.innerText = "Very Poor";
  } else if (aqi === 4) {
    color = "orange";
    aqiDescEl.innerText = "Poor";
  } else if (aqi === 3) {
    color = "yellow";
    aqiDescEl.innerText = "Moderate";
  } else if (aqi === 2) {
    color = "steelblue";
    aqiDescEl.innerText = "Fair";
  } else {
    color = "green";
    aqiDescEl.innerText = "Good";
  }
  aqiEl.innerText = aqi;
  aqiEl.style.color = `${color}`;
  aqiDescEl.style.color = `${color}`;
}
