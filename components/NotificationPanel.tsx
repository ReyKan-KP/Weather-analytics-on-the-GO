"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Droplets, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WeatherChange {
  type: "temperature" | "humidity" | "rainfall";
  title: string;
  message: string;
  change: number;
}

interface NotificationPanelProps {
  weatherChanges: WeatherChange[];
}

export default function NotificationPanel({
  weatherChanges,
}: NotificationPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Cloud className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      case "humidity":
        return (
          <Droplets className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
        );
      case "rainfall":
        return (
          <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="bg-background/80 backdrop-blur-sm border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-4">
          <AnimatePresence>
            {weatherChanges.map((change, index) => (
              <motion.div
                key={`${change.type}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="group relative mb-2 last:mb-0"
              >
                <div className="absolute inset-0 rounded-lg bg-muted/0 group-hover:bg-muted/50 transition-colors" />
                <div className="relative flex items-start gap-4 rounded-lg p-3">
                  <div className="mt-1 p-2 rounded-full bg-background/80 backdrop-blur-sm dark:bg-muted/80 group-hover:bg-background dark:group-hover:bg-muted transition-colors">
                    {getIcon(change.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{change.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {change.message}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground/80">
                      Just now
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {weatherChanges.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No significant weather changes
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
