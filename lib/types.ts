export interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    timestamp: string;
}

export interface HistoricalWeatherData {
    timestamp: string;
    temperature: number;
    humidity: number;
    rainfall: number;
}
