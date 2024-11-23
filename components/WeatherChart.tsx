"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

export default function WeatherChart({ data }: WeatherChartProps) {
  const [activeMetric, setActiveMetric] = useState<
    "all" | "temperature" | "humidity" | "rainfall"
  >("all");

  const chartColors = {
    temperature: "hsl(217, 91%, 60%)",
    humidity: "hsl(142, 71%, 45%)",
    rainfall: "hsl(262, 83%, 58%)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 dark:border-slate-700/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold dark:text-slate-100">
            Weather Trends
          </CardTitle>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" onClick={() => setActiveMetric("all")}>
                All Metrics
              </TabsTrigger>
              <TabsTrigger
                value="temperature"
                onClick={() => setActiveMetric("temperature")}
              >
                Temperature
              </TabsTrigger>
              <TabsTrigger
                value="humidity"
                onClick={() => setActiveMetric("humidity")}
              >
                Humidity
              </TabsTrigger>
              <TabsTrigger
                value="rainfall"
                onClick={() => setActiveMetric("rainfall")}
              >
                Rainfall
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted dark:stroke-muted/30"
                />
                <XAxis
                  dataKey="time"
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ strokeWidth: 1 }}
                />
                <YAxis
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ strokeWidth: 1 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend wrapperStyle={{ paddingTop: "1rem" }} />
                {(activeMetric === "all" || activeMetric === "temperature") && (
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke={chartColors.temperature}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                )}
                {(activeMetric === "all" || activeMetric === "humidity") && (
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke={chartColors.humidity}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                )}
                {(activeMetric === "all" || activeMetric === "rainfall") && (
                  <Line
                    type="monotone"
                    dataKey="rainfall"
                    stroke={chartColors.rainfall}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
