import { WeatherData, HistoricalWeatherData } from './types';

export function generateCSV(currentWeather: WeatherData, historicalData: HistoricalWeatherData[]): string {
    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Rainfall (mm)'];
    const rows = [
        headers.join(','),
        formatDataRow(currentWeather),
        ...historicalData.map(formatDataRow)
    ];
    return rows.join('\n');
}

function formatDataRow(data: WeatherData | HistoricalWeatherData): string {
    return [
        data.timestamp,
        data.temperature.toFixed(2),
        data.humidity.toFixed(2),
        data.rainfall.toFixed(2)
    ].join(',');
}

export function downloadCSV(csvContent: string, fileName: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
