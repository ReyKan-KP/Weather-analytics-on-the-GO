"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import WeatherChart from "./WeatherChart";
import WeatherCard from "./WeatherCard";
// import WeatherCalendar from "./WeatherCalendar";
import {
  fetchWeatherData,
  fetchHistoricalWeatherData,
  WeatherData,
  HistoricalWeatherData,
} from "../lib/api";

export default function Dashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] =
    useState<HistoricalWeatherData | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<string>("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherData();
        if (data) {
          setWeatherData(data);
          setLocation(data.location);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLocation("Location unavailable");
      }
    };

    const fetchHistorical = async () => {
      try {
        const data = await fetchHistoricalWeatherData();
        setHistoricalData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchData();
    fetchHistorical();

    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!weatherData || !historicalData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse text-lg">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
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
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
          >
            Weather Analytics on the GO
          </motion.h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <MapPin className="h-4 w-4" />
            <span>{currentDateTime.toLocaleString()}</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeatherCard
            title="Temperature"
            value={`${weatherData.temperature}°C`}
            type="temperature"
            trend="stable"
          />
          <WeatherCard
            title="Humidity"
            value={`${weatherData.humidity}%`}
            type="humidity"
            trend="up"
          />
          <WeatherCard
            title="Rainfall"
            value={`${weatherData.rainfall} mm`}
            type="rainfall"
            trend="down"
          />
        </div>

        <div className="grid gap-6">
          <WeatherChart data={weatherData.historicalData} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border-2 dark:border-muted bg-card p-6"
        >
          {/* <h2 className="text-xl font-semibold mb-4">
            Historical Weather Data
          </h2>
          <WeatherCalendar /> */}
        </motion.div>
      </motion.div>
    </div>
  );
}
