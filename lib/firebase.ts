import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, DatabaseReference } from "firebase/database";
import type { WeatherData, HistoricalWeatherData } from "./types";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "weather-analytics-on-the-go.firebaseapp.com",
    databaseURL: "https://weather-analytics-on-the-go-default-rtdb.firebaseio.com",
    projectId: "weather-analytics-on-the-go",
    storageBucket: "weather-analytics-on-the-go.appspot.com",
    messagingSenderId: "410989431784",
    appId: "1:410989431784:web:4be7ef5b8b3df02803f25d",
    measurementId: "G-ZSS8LGM9RL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function fetchRealtimeWeatherData(): Promise<{
    current: WeatherData;
    previousHour: WeatherData | null;
    historical: HistoricalWeatherData[]
}> {
    try {
        const dbRef: DatabaseReference = ref(database, '/');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const entries = Object.values(data).sort((a: any, b: any) =>
                new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime()
            );

            const latestEntry = entries[entries.length - 1] as any;
            const currentTime = new Date(latestEntry.DateTime);
            const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

            const previousHourEntry = entries.reverse().find((entry: any) =>
                new Date(entry.DateTime) <= oneHourAgo
            ) as any;

            const formatWeatherData = (entry: any): WeatherData => ({
                temperature: Number(entry['Temperature (°C)']) || 0,
                humidity: Number(entry['Humidity (%)']) || 0,
                rainfall: Number(entry['Rainfall (mm)']) || 0,
                timestamp: entry.DateTime,
            });

            const currentWeather = formatWeatherData(latestEntry);
            const previousHourWeather = previousHourEntry ? formatWeatherData(previousHourEntry) : null;

            const historicalData: HistoricalWeatherData[] = entries.map(formatWeatherData);

            return {
                current: currentWeather,
                previousHour: previousHourWeather,
                historical: historicalData,
            };
        }

        throw new Error("No data available");
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

