"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, AlertTriangle } from "lucide-react";
import WeatherChart from "./WeatherChart";
import WeatherCard from "./WeatherCard";
import NotificationPanel from "./NotificationPanel";
import { Button } from "@/components/ui/button";
import { fetchRealtimeWeatherData } from "../lib/firebase";
import { generateCSV, downloadCSV } from "../lib/csvUtils";
import type { WeatherData, HistoricalWeatherData } from "../lib/types";
import Navbar from "./Navbar";

type Trend = "up" | "down" | "stable";

interface WeatherChange {
  type: "temperature" | "humidity" | "rainfall";
  title: string;
  message: string;
  change: number;
}

export default function Dashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [previousHourData, setPreviousHourData] = useState<WeatherData | null>(
    null
  );
  const [historicalData, setHistoricalData] = useState<HistoricalWeatherData[]>(
    []
  );
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [weatherChanges, setWeatherChanges] = useState<WeatherChange[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRealtimeWeatherData();
        setWeatherData(data.current);
        setPreviousHourData(data.previousHour);
        setHistoricalData(data.historical);
        setError(null);

        if (data.previousHour) {
          const changes: WeatherChange[] = [];
          const thresholds = {
            temperature: 5,
            humidity: 10,
            rainfall: 2,
          };

          const calculateChange = (
            current: number,
            previous: number,
            type: keyof typeof thresholds
          ) => {
            const change = current - previous;
            if (Math.abs(change) >= thresholds[type]) {
              const direction = change > 0 ? "increase" : "decrease";
              const title = `Significant ${
                type.charAt(0).toUpperCase() + type.slice(1)
              } ${direction}`;
              const message = `${
                type.charAt(0).toUpperCase() + type.slice(1)
              } ${direction}d by ${Math.abs(change).toFixed(1)} ${
                type === "temperature" ? "°C" : type === "humidity" ? "%" : "mm"
              }`;
              changes.push({ type, title, message, change });
            }
          };

          calculateChange(
            data.current.temperature,
            data.previousHour.temperature,
            "temperature"
          );
          calculateChange(
            data.current.humidity,
            data.previousHour.humidity,
            "humidity"
          );
          calculateChange(
            data.current.rainfall,
            data.previousHour.rainfall,
            "rainfall"
          );

          setWeatherChanges(changes);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Unable to fetch weather data. Please try again later.");
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
      fetchData();
    }, 60000); // Fetch every minute

    return () => clearInterval(interval);
  }, []);

  const calculateTrend = (current: number, previous: number): Trend => {
    const difference = current - previous;
    if (Math.abs(difference) < 0.1) return "stable";
    return difference > 0 ? "up" : "down";
  };

  const handleDownloadCSV = () => {
    if (weatherData && historicalData.length > 0) {
      const csv = generateCSV(weatherData, historicalData);
      downloadCSV(csv, `weather_data_${new Date().toISOString()}.csv`);
    }
  };

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <div className="text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  if (!weatherData || !previousHourData || historicalData.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse text-lg">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar  weatherChanges={weatherChanges}/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 sm:p-6 space-y-6"
      >
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
          >
            Weather Analytics on the GO
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <span>{currentDateTime.toLocaleString()}</span>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeatherCard
            title="Temperature"
            value={`${weatherData.temperature.toFixed(1)}°C`}
            type="temperature"
            trend={calculateTrend(
              weatherData.temperature,
              previousHourData.temperature
            )}
          />
          <WeatherCard
            title="Humidity"
            value={`${weatherData.humidity.toFixed(1)}%`}
            type="humidity"
            trend={calculateTrend(
              weatherData.humidity,
              previousHourData.humidity
            )}
          />
          <WeatherCard
            title="Rainfall"
            value={`${weatherData.rainfall.toFixed(1)} mm`}
            type="rainfall"
            trend={calculateTrend(
              weatherData.rainfall,
              previousHourData.rainfall
            )}
          />
        </div>

        <div className="grid gap-6">
          <WeatherChart data={historicalData} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border-2 dark:border-muted bg-card p-6 flex justify-center"
        >
          <Button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
