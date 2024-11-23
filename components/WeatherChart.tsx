"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeatherChartProps {
  data: Array<{
    time: string;
    temperature: number;
    humidity: number;
    rainfall: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-xl">
        <span className="text-gray-900/80 dark:text-gray-200 font-medium mb-2">
          Time: {label}
        </span>
        {payload.map((entry: any, index: number) => (
          <p
            key={`item-${index}`}
            className="font-medium"
            style={{ color: entry.stroke }}
          >
            {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}:{" "}
            {entry.value}
            {entry.name === "Temperature"
              ? " °C"
              : entry.name === "Humidity"
              ? " %"
              : " mm"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeatherChart({ data }: WeatherChartProps) {
  const [activeMetric, setActiveMetric] = useState<
    "all" | "temperature" | "humidity" | "rainfall"
  >("all");

  const chartColors = {
    temperature: "#FF5733",
    humidity: "#DAA520",
    rainfall: "#1E90FF",
  };

  const tabVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.05 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-900"
    >
      <Card className="border-2 dark:border-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Weather Trends
          </CardTitle>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 p-1 bg-blue-100 dark:bg-slate-700 rounded-lg gap-1">
              {["all", "temperature", "humidity", "rainfall"].map((tab) => (
                <motion.div
                  key={tab}
                  variants={tabVariants}
                  initial="inactive"
                  animate={activeMetric === tab ? "active" : "inactive"}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <TabsTrigger
                    value={tab}
                    onClick={() => setActiveMetric(tab as typeof activeMetric)}
                    className={`w-full py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                      activeMetric === tab
                        ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[400px] mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ strokeWidth: 1 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ strokeWidth: 1 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "1rem" }}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {value}
                      </span>
                    )}
                  />
                  {(activeMetric === "all" ||
                    activeMetric === "temperature") && (
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature"
                      stroke={chartColors.temperature}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                    />
                  )}
                  {(activeMetric === "all" || activeMetric === "humidity") && (
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      name="Humidity"
                      stroke={chartColors.humidity}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                    />
                  )}
                  {(activeMetric === "all" || activeMetric === "rainfall") && (
                    <Line
                      type="monotone"
                      dataKey="rainfall"
                      name="Rainfall"
                      stroke={chartColors.rainfall}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
