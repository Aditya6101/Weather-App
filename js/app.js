//  ! API KEY
const API_KEY = '15abe8b87abbb3ba3fafdc7ee0dd5e8b';

let countryCode = '';

// ? Getting DOM Elements

const form = document.getElementById('form');
const input = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
// ? Calling Function to load weather data on page load

window.addEventListener('load', () => getWeatherDataOnLoad());

// ? Listening for submit event on the form

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = input.value;
  validateSearchTerm(searchTerm);
  form.reset();
});

searchBtn.addEventListener('submit', () => {
  return true;
});

// * Validating User Input and getting weather data according to matched format

function validateSearchTerm(value) {
  if (value === '') {
    alert('😒😒😒Please Enter Valid Term😒😒😒');
    return false;
  } else {
    // ? Regex for City Name

    const expForCityName = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
    const regexForCity = new RegExp(expForCityName);

    // ? Regex For Zip Code

    const expForZipCode = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/;
    const regexForZipCode = new RegExp(expForZipCode);

    if (value.match(regexForZipCode) && !value.match(regexForCity)) {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${value},${countryCode}&appid=${API_KEY}`;

      getWeatherData(weatherURL);
    } else if (value.match(regexForCity) && !value.match(regexForZipCode)) {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}`;

      getWeatherData(weatherURL);
    }
  }
}

// * Function to load weather data on page load

function getWeatherDataOnLoad() {
  if ('geolocation' in navigator) {
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
    const { description: desc } = data.weather[0];
    const { speed } = data.wind;
    const { name: city } = data;
    const { country } = data.sys;

    countryCode = country;

    // ? Calling function to display fetched Weather Data to the DOM Elements

    showWeatherData(
      temp,
      desc,
      humidity,
      temp_min,
      temp_max,
      speed,
      pressure,
      city,
      country
    );
    const airQualityURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    // ? Calling function to get Air Quality Data

    getAirQuality(airQualityURL);
  } catch (error) {
    console.log(error);
  }
}

async function getAirQuality(URL) {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    const { aqi } = data.list[0].main;
    const { co, no, o3, pm2_5 } = data.list[0].components;

    // ? Calling function to display fetched Air Quality Data the DOM Elements

    showAirQuality(aqi, co, no, o3, pm2_5);
  } catch (error) {
    console.log(error);
  }
}

// * Function to Display Weather Data

function showWeatherData(
  temp,
  desc,
  humidity,
  temp_min,
  temp_max,
  speed,
  pressure,
  city,
  country
) {
  const temperatureEl = document.querySelectorAll('.temperature');
  const descEl = document.querySelectorAll('.weather-desc');
  const humidityEl = document.getElementById('humidity');
  const windSpeedEl = document.getElementById('wind-speed');
  const pressureEl = document.getElementById('pressure');
  const cityEl = document.querySelectorAll('.city');
  const countryEl = document.querySelectorAll('.country');
  const tempMinEl = document.querySelectorAll('.temp-min');
  const tempMaxEl = document.querySelectorAll('.temp-max');
  const tempInC = temp - 273.15;
  const tempMinInC = temp_min - 273.15;
  const tempMaxInC = temp_max - 273.15;
  temperatureEl.forEach((el) => (el.innerText = Math.floor(tempInC)));
  descEl.forEach((el) => (el.innerText = desc));
  cityEl.forEach((el) => (el.innerHTML = city));
  countryEl.forEach((el) => (el.innerHTML = country));
  tempMinEl.forEach((el) => (el.innerText = tempMinInC));
  tempMaxEl.forEach((el) => (el.innerText = tempMaxInC));
  humidityEl.innerText = humidity;
  windSpeedEl.innerText = speed;
  pressureEl.innerText = pressure;
}

// * Function to Display Air Quality Data

function showAirQuality(aqi, co, no, o3, pm2_5) {
  const aqiEl = document.getElementById('aqi');
  const aqiDescEl = document.getElementById('aqi-desc');
  const coEl = document.getElementById('co');
  const noEl = document.getElementById('no');
  const ozoneEl = document.getElementById('ozone');
  const fpmEl = document.getElementById('fpm');
  aqiEl.innerText = aqi;
  coEl.innerText = co;
  noEl.innerText = no;
  ozoneEl.innerText = o3;
  fpmEl.innerText = pm2_5;

  let color = '';
  if (aqi === 5) {
    color = 'red';
    aqiDescEl.innerText = 'Very Poor';
  } else if (aqi === 4) {
    color = 'orange';
    aqiDescEl.innerText = 'Poor';
  } else if (aqi === 3) {
    color = 'yellow';
    aqiDescEl.innerText = 'Moderate';
  } else if (aqi === 2) {
    color = '#2b8000';
    aqiDescEl.innerText = 'Fair';
  } else {
    color = 'green';
    aqiDescEl.innerText = 'Good';
  }
  aqiEl.style.color = `${color}`;
  aqiDescEl.style.color = `${color}`;
}
