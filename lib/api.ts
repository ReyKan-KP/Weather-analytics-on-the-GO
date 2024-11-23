import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
    temperature: number | null;
    humidity: number | null;
    rainfall: number | null;
    location: string;
    historicalData: Array<{
        time: string;
        temperature: number;
        humidity: number;
        rainfall: number;
    }>;
}

export interface HistoricalWeatherData {
    [date: string]: {
        temperature: number;
        humidity: number;
        rainfall: number;
    };
}

export async function fetchWeatherData(): Promise<WeatherData> {
    try {
        // Use the Geolocation API to get user's location
        const getCoordinates = (): Promise<{ latitude: number; longitude: number }> => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => reject(error)
                );
            });
        };

        // Get user's coordinates
        const { latitude, longitude } = await getCoordinates();

        // Fetch weather data using the coordinates
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                lat: latitude,
                lon: longitude,
                appid: API_KEY,
                units: 'metric'
            }
        });

        // Generate mock historical data for the chart
        const historicalData = Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            temperature: Math.round(response.data.main.temp + (Math.random() - 0.5) * 5),
            humidity: Math.round(response.data.main.humidity + (Math.random() - 0.5) * 10),
            rainfall: Math.round(Math.random() * 5),
        }));

        return {
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            rainfall: response.data.rain ? response.data.rain['1h'] : 0,
            location: response.data.name,
            historicalData,
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            temperature: null,
            humidity: null,
            rainfall: null,
            location: 'Unknown',
            historicalData: [],
        };
    }
}

export async function fetchHistoricalWeatherData(): Promise<HistoricalWeatherData> {
    try {
        // Note: OpenWeatherMap's free tier doesn't provide historical data
        // This is a mock function. In a real app, you'd use a paid API or your own database
        const historicalData: HistoricalWeatherData = {};
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            historicalData[dateString] = {
                temperature: Math.round(Math.random() * 30),
                humidity: Math.round(Math.random() * 100),
                rainfall: Math.round(Math.random() * 50)
            };
        }

        return historicalData;
    } catch (error) {
        console.error('Error fetching historical weather data:', error);
        return {};
    }
}
