import { NextRequest, NextResponse } from 'next/server'
import { format, eachDayOfInterval, parseISO, isValid } from 'date-fns'

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const CITY_ID = '2643743' // London city ID

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const start = searchParams.get('start')
        const end = searchParams.get('end')

        if (!start || !end) {
            return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 })
        }

        const startDate = parseISO(start)
        const endDate = parseISO(end)

        if (!isValid(startDate) || !isValid(endDate)) {
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
        }

        const dates = eachDayOfInterval({ start: startDate, end: endDate })

        const weatherData = await Promise.all(
            dates.map(async (date) => {
                const formattedDate = format(date, 'yyyy-MM-dd')
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?id=${CITY_ID}&dt=${Math.floor(date.getTime() / 1000)}&appid=${API_KEY}&units=metric`
                )

                if (!response.ok) {
                    throw new Error(`OpenWeatherMap API error: ${response.statusText}`)
                }

                const data = await response.json()

                return {
                    date: formattedDate,
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    rainfall: data.rain ? data.rain['1h'] || 0 : 0,
                }
            })
        )

        return NextResponse.json(weatherData)
    } catch (error) {
        console.error('Error in weather API route:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

