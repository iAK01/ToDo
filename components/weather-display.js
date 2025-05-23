// Weather Display Component - shows the weather forecast
import { WeatherAPI } from '../data/weather-api.js';

export class WeatherDisplay {
    constructor(options) {
        this.container = options.container;
        this.location = options.location || 'Dublin';
        this.days = options.days || 5;

        this.weatherAPI = new WeatherAPI();
        this.renderSkeleton();
        this.loadWeather();
    }

    renderSkeleton() {
        this.container.innerHTML = `
            <div class="weather-section" id="weatherSection">
                <h3>🌤️ Weather Forecast</h3>
                <div id="weatherCards" class="weather-cards">Loading...</div>
            </div>
        `;
    }

    async loadWeather() {
        const weatherCards = this.container.querySelector('#weatherCards');
        try {
            const data = await this.weatherAPI.getWeather(this.location, this.days);
            weatherCards.innerHTML = data.map(day => this.renderDayCard(day)).join('');
        } catch (error) {
            weatherCards.innerHTML = `<p class="error">Failed to load weather: ${error.message}</p>`;
        }
    }

    renderDayCard(day) {
        return `
            <div class="weather-card">
                <div class="date">${day.date}</div>
                <div class="icon">${day.icon}</div>
                <div class="condition">${day.condition}</div>
                <div class="temp">${day.temp}°C</div>
                <div class="range">↑ ${day.maxTemp}° | ↓ ${day.minTemp}°</div>
                <div class="details">💧 ${day.humidity}% | ☔ ${day.chanceOfRain}% | 🌬️ ${day.wind} km/h</div>
            </div>
        `;
    }
}
