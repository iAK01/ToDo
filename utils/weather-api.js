// Weather API utility - handles weather data fetching with fallback to Open-Meteo
export class WeatherAPI {
    constructor() {
        // Free weatherapi.com key
        this.apiKey = '90c4c9014ba54aecadd160109231806';
        this.baseUrl = 'https://api.weatherapi.com/v1/forecast.json';
    }

    async getWeather(location, days, startDate = new Date()) {
        const forecastDays = Math.min(days, 10);
        const today = new Date();
        const start = new Date(startDate);
        const diffDays = Math.round((start - today) / (1000 * 60 * 60 * 24));

        if (diffDays > 3) {
            console.warn('Too far in future for free WeatherAPI — falling back to Open-Meteo');
            return await this.getOpenMeteoWeather(location, startDate, days);
        }

        try {
            const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(location)}&days=${forecastDays}&aqi=no&alerts=no`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) throw new Error(data.error.message);

            return this.processWeatherData(data);
        } catch (error) {
            console.warn('WeatherAPI failed, falling back to Open-Meteo:', error.message);
            return await this.getOpenMeteoWeather(location, startDate, days);
        }
    }

    processWeatherData(data) {
        const weatherData = [];

        data.forecast.forecastday.forEach(day => {
            const date = new Date(day.date);
            const condition = day.day.condition.text;
            const temp = Math.round(day.day.avgtemp_c);
            const icon = this.getWeatherIcon(condition, temp);

            weatherData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                condition: condition,
                temp: temp,
                icon: icon,
                humidity: day.day.avghumidity,
                chanceOfRain: day.day.daily_chance_of_rain,
                maxTemp: Math.round(day.day.maxtemp_c),
                minTemp: Math.round(day.day.mintemp_c),
                wind: day.day.maxwind_kph,
                uv: day.day.uv
            });
        });

        return weatherData;
    }

    async getOpenMeteoWeather(location, startDate, days) {
        const coords = await this.geocodeLocation(location);
        if (!coords) throw new Error('Failed to geocode location for Open-Meteo');

        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + days - 1);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&start_date=${start.toISOString().split('T')[0]}&end_date=${end.toISOString().split('T')[0]}&timezone=auto`;

        const res = await fetch(url);
        const data = await res.json();

        return data.daily.time.map((date, i) => {
            const condition = this.translateWeatherCode(data.daily.weathercode[i]);
            const temp = Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2);
            return {
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                condition: condition,
                temp: temp,
                icon: this.getWeatherIcon(condition, temp),
                humidity: null,
                chanceOfRain: Math.min(data.daily.precipitation_sum[i] * 10, 100),
                maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                minTemp: Math.round(data.daily.temperature_2m_min[i]),
                wind: null,
                uv: null
            };
        });
    }

    async geocodeLocation(location) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.results || data.results.length === 0) return null;
        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude
        };
    }

    translateWeatherCode(code) {
        const map = {
            0: 'Clear',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Rime fog',
            51: 'Light drizzle',
            53: 'Drizzle',
            55: 'Heavy drizzle',
            61: 'Light rain',
            63: 'Rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Snow',
            75: 'Heavy snow',
            80: 'Rain showers',
            81: 'Heavy showers',
            95: 'Thunderstorm'
        };
        return map[code] || 'Unknown';
    }

    getWeatherIcon(condition, temp = 20) {
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return '🌧️';
        } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            return '⛈️';
        } else if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
            return '❄️';
        } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
            return '🌫️';
        } else if (conditionLower.includes('overcast') || conditionLower.includes('cloudy')) {
            return '☁️';
        } else if (conditionLower.includes('partly cloudy')) {
            return '⛅';
        } else if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
            return temp > 30 ? '🌞' : '☀️';
        } else if (temp < 5) {
            return '🥶';
        } else {
            return '🌤️';
        }
    }

    getFallbackWeather(days) {
        const weatherData = [];
        const startDate = new Date();

        for (let i = 0; i < Math.min(days, 7); i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            const seed = date.getDate() + date.getMonth();
            const temp = 15 + (seed % 15) - 5;
            const conditions = ['Partly Cloudy', 'Sunny', 'Cloudy', 'Light Rain'];
            const condition = conditions[seed % conditions.length];

            weatherData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                condition: condition,
                temp: temp,
                icon: this.getWeatherIcon(condition, temp),
                humidity: 40 + (seed % 40),
                chanceOfRain: condition.includes('Rain') ? 60 : 20,
                maxTemp: temp + 5,
                minTemp: temp - 5,
                wind: 10 + (seed % 20),
                uv: 3 + (seed % 5)
            });
        }

        return weatherData;
    }
}
