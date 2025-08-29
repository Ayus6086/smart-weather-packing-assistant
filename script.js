const locationEl = document.getElementById("location");
const weatherEl = document.getElementById("weather");
const suggestionsEl = document.getElementById("suggestions");
const form = document.getElementById("city-form");
const input = document.getElementById("city-input");

const API_KEY = "66cabf440a3925d1e6091498ce4feea7"; // Replace with your OpenWeatherMap API key

// Fetch weather using coordinates
function getWeatherByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    })
    .then(displayWeatherData)
    .catch(() => {
      weatherEl.textContent = "❌ Failed to fetch weather data.";
    });
}

// Fetch weather using city name
async function getWeatherByCity(city) {
  locationEl.textContent = `City: ${city}`;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeatherData(data);
  } catch (error) {
    weatherEl.textContent = "❌ City not found. Please try again.";
    suggestionsEl.innerHTML = "";
  }
}

// Display weather + suggestions
function displayWeatherData(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].main.toLowerCase();
  const description = data.weather[0].description;
  const city = data.name;
  const icon = data.weather[0].icon;
  function updateBackground(condition) {
  let backgroundUrl = "";

  if (condition.includes("rain")) {
    backgroundUrl = "url('images/rainy.jpg')";
  } else if (condition.includes("cloud")) {
    backgroundUrl = "url('images/cloudy.jpg')";
  } else if (condition.includes("clear")) {
    backgroundUrl = "url('images/sunny.jpg')";
  } else if (condition.includes("snow")) {
    backgroundUrl = "url('images/snow.jpg')";
  } else {
    backgroundUrl = "url('images/default.jpg')";
  }

  document.body.style.backgroundImage = backgroundUrl;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

  weatherEl.innerHTML = `
    <div class="sub-info">
      <h3>Weather in ${city}</h3>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
    </div>
    <p>It's currently <strong>${temp}°C</strong> with <em>${description}</em>.</p>
  `;
  updateBackground(description);
  const suggestions = getPackingSuggestions(condition, temp);
  suggestionsEl.innerHTML = suggestions
    .map((item) => `<li>${item}</li>`)
    .join("");

}


// Packing logic
function getPackingSuggestions(condition, temp) {
  const items = [];

  if (condition.includes("rain")) {
    items.push("☔ Raincoat or umbrella");
  }
  if (condition.includes("clear")) {
    items.push("🕶️ Sunglasses");
    items.push("🧴 Sunscreen");
  }
  if (condition.includes("snow")) {
    items.push("🧥 Warm jacket");
    items.push("🧤 Gloves");
  }
  if (condition.includes("cloud")) {
    items.push("🧢 Light jacket");
  }

  if (temp < 15) {
  items.push("🧥 Sweater", "👟 Comfortable shoes");
  } else if (temp > 15) {
    items.push("💧 Water bottle");
    items.push("🧢 Cap or hat");
  }

  if (items.length === 0) {
    items.push("👍 You're good to go!");
  }

  return items;
}

// Get user's location by default
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        locationEl.textContent = `Your coordinates: (${lat.toFixed(
          2
        )}, ${lon.toFixed(2)})`;
        getWeatherByCoords(lat, lon);
      },
      () => {
        locationEl.textContent = "⚠️ Couldn't get your location.";
        weatherEl.textContent = "Please enter a city instead.";
      }
    );
  } else {
    locationEl.textContent = "Geolocation not supported.";
  }
}

// Handle city form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});

// Initial call using location
getLocationWeather();

const themeToggleBtn = document.getElementById("toggle-theme");

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggleBtn.textContent = "☀️ Toggle Light Mode";
}