"use client";

import { motion } from "framer-motion";
import { Cloud, Droplets, Umbrella } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherCardProps {
  title: string;
  value: string;
  type: "temperature" | "humidity" | "rainfall";
  trend?: "up" | "down" | "stable";
}

export default function WeatherCard({
  title,
  value,
  type,
  trend,
}: WeatherCardProps) {
  const getIcon = () => {
    switch (type) {
      case "temperature":
        return <Cloud className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      case "humidity":
        return (
          <Droplets className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
        );
      case "rainfall":
        return (
          <Umbrella className="h-6 w-6 text-violet-500 dark:text-violet-400" />
        );
    }
  };

  const getGradient = () => {
    switch (type) {
      case "temperature":
        return "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent";
      case "humidity":
        return "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 dark:to-transparent";
      case "rainfall":
        return "bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent dark:from-violet-500/20 dark:via-violet-500/10 dark:to-transparent";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-500 dark:text-emerald-400";
      case "down":
        return "text-rose-500 dark:text-rose-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`${getGradient()} border-2 dark:border-muted`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {getIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tighter">{value}</div>
          <div
            className={`text-sm mt-1 flex items-center gap-1 ${getTrendColor()}`}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "stable" && "→"}
            <span>
              {trend === "up" && "Increasing"}
              {trend === "down" && "Decreasing"}
              {trend === "stable" && "Stable"}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
