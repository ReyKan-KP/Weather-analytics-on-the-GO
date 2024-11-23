import { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'

type WeatherData = {
    date: string
    temperature: number
    humidity: number
    rainfall: number
}

export function useWeatherData() {
    const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const endDate = new Date()
                const startDate = subDays(endDate, 30)
                const response = await fetch(`/api/weather?start=${format(startDate, 'yyyy-MM-dd')}&end=${format(endDate, 'yyyy-MM-dd')}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch weather data: ${response.statusText}`)
                }

                const data = await response.json()
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from API')
                }

                setWeatherData(data)
            } catch (err) {
                console.error('Error fetching weather data:', err)
                setError(err instanceof Error ? err.message : 'An unknown error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchWeatherData()
    }, [])

    return { weatherData, isLoading, error }
}

