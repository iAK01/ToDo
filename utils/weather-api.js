// Weather API utility - handles weather data fetching
export class WeatherAPI {
    constructor() {
        // Free weather API key - replace with your own for production
        this.apiKey = '90c4c9014ba54aecadd160109231806';
        this.baseUrl = 'https://api.weatherapi.com/v1/forecast.json';
    }

    async getWeather(location, days) {
        // Limit to API maximum
        const forecastDays = Math.min(days, 10);
        
        try {
            const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(location)}&days=${forecastDays}&aqi=no&alerts=no`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return this.processWeatherData(data);
            
        } catch (error) {
            console.error('Weather API error:', error);
            throw error;
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
                date: date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }),
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

    getWeatherIcon(condition, temp) {
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
            if (temp > 30) {
                return '🌞';
            } else {
                return '☀️';
            }
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
            
            // Generate pseudo-random but consistent weather
            const seed = date.getDate() + date.getMonth();
            const temp = 15 + (seed % 15) - 5;
            const conditions = ['Partly Cloudy', 'Sunny', 'Cloudy', 'Light Rain'];
            const condition = conditions[seed % conditions.length];
            
            weatherData.push({
                date: date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }),
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
