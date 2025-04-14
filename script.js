const apiKey = "5fd71440e23c4e935cacbc161d68aaa3";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");

const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const iconElement = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("hourly-forecast");

searchBtn.addEventListener("click", () => {
    const city = locationInput.value.trim();
    if (!city) {
        alert("Please enter a city");
        return;
    }

    fetchWeather(city);
    fetchForecast(city);
});

function fetchWeather(city) {
    const url = `${currentWeatherUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === 200) {
                locationElement.textContent = data.name;
                temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
                descriptionElement.textContent = data.weather[0].description;
                const iconCode = data.weather[0].icon;
                iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
                iconElement.alt = data.weather[0].description;
                iconElement.style.display = 'block';
            } else {
                locationElement.textContent = '';
                temperatureElement.textContent = '';
                descriptionElement.textContent = '';
                iconElement.style.display = 'none';
                alert("City not found");
            }
        })
        .catch(error => {
            console.error("Weather fetch error:", error);
            alert("Error fetching weather data.");
        });
}

function fetchForecast(city) {
    const url = `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            forecastContainer.innerHTML = ''; // clear old forecast
            const forecastItems = data.list.slice(0, 8); // next 24 hours (3-hour intervals)

            forecastItems.forEach(item => {
                const hour = new Date(item.dt * 1000).getHours();
                const temp = Math.round(item.main.temp);
                const icon = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

                const forecastHtml = `
                    <div class="hourly-item">
                        <span>${hour}:00</span>
                        <img src="${iconUrl}" alt="Icon">
                        <span>${temp}°C</span>
                    </div>
                `;
                forecastContainer.innerHTML += forecastHtml;
            });
        })
        .catch(error => {
            console.error("Forecast fetch error:", error);
            alert("Error fetching forecast.");
        });
}
