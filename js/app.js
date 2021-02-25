const API_KEY = '15abe8b87abbb3ba3fafdc7ee0dd5e8b';

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = +position.coords.latitude;
    const lon = +position.coords.longitude;
    getWeatherData(lat, lon);
    getAirQuality(lat, lon);
  });
} else {
  alert("Sorry Your Browser Doesn't Support Geolocation!!!");
}

async function getWeatherData(lat, lon) {
  const URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(URL);
  const data = await res.json();
  const { temp, pressure, humidity } = data.main;
  const { description: desc } = data.weather[0];
  const { speed } = data.wind;
  const { name: city } = data;
  const { country } = data.sys;
  showWeatherData(temp, desc, humidity, speed, pressure, city, country);
}

async function getAirQuality(lat, lon) {
  const URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(URL);
  const data = await res.json();
  const { aqi } = data.list[0].main;
  const { co, no, o3, pm2_5 } = data.list[0].components;
  showAirQuality(aqi, co, no, o3, pm2_5);
}

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
  if (aqi === 5) {
    aqiEl.style.color = 'red';
    aqiDescEl.style.color = 'red';
    aqiDescEl.innerText = 'Very Poor';
  } else if (aqi === 4) {
    aqiEl.style.color = 'orange';
    aqiDescEl.style.color = 'orange';
    aqiDescEl.innerText = 'Poor';
  } else if (aqi === 4) {
    aqiEl.style.color = 'yellow';
    aqiDescEl.style.color = 'yellow';
    aqiDescEl.innerText = 'Poor';
  } else {
    aqiEl.style.color = 'green';
    aqiDescEl.style.color = 'green';
    aqiDescEl.innerText = 'Poor';
  }
}

function showWeatherData(temp, desc, humidity, speed, pressure, city, country) {
  const temperatureEl = document.querySelectorAll('.temperature');
  const descEl = document.querySelectorAll('.weather-desc');
  const humidityEl = document.getElementById('humidity');
  const windSpeedEl = document.getElementById('wind-speed');
  const pressureEl = document.getElementById('pressure');
  const cityEl = document.querySelectorAll('.city');
  const countryEl = document.querySelectorAll('.country');
  const tempInC = temp - 273.15;
  temperatureEl.forEach((el) => (el.innerText = Math.floor(tempInC)));
  descEl.forEach((el) => (el.innerText = desc));
  cityEl.forEach((el) => (el.innerHTML = city));
  countryEl.forEach((el) => (el.innerHTML = country));
  humidityEl.innerText = humidity;
  windSpeedEl.innerText = speed;
  pressureEl.innerText = pressure;
}
