// "use client";

// import { useState } from "react";
// import { format, isValid } from "date-fns";
// import { motion } from "framer-motion";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useWeatherData } from "@/hooks/useWeatherData";

// type WeatherData = {
//   date: string;
//   temperature: number;
//   humidity: number;
//   rainfall: number;
// };

// export default function WeatherCalendar() {
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const { weatherData, isLoading, error } = useWeatherData();

//   const getDayWeather = (day: Date | undefined): WeatherData | undefined => {
//     if (!day || !isValid(day)) return undefined;
//     const formattedDate = format(day, "yyyy-MM-dd");
//     return weatherData?.find((data) => data.date === formattedDate);
//   };

//   if (isLoading) return <div>Loading weather data...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <TooltipProvider>
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         className="rounded-md border"
//         components={{
//           Day: ({ date: day, ...props }) => {
//             const dayWeather = getDayWeather(day);
//             return (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <Calendar.Day {...props} />
//                   </motion.div>
//                 </TooltipTrigger>
//                 {dayWeather && (
//                   <TooltipContent>
//                     <div className="text-sm">
//                       <p>Temperature: {dayWeather.temperature.toFixed(1)}°C</p>
//                       <p>Humidity: {dayWeather.humidity}%</p>
//                       <p>Rainfall: {dayWeather.rainfall.toFixed(2)} mm</p>
//                     </div>
//                   </TooltipContent>
//                 )}
//               </Tooltip>
//             );
//           },
//         }}
//       />
//     </TooltipProvider>
//   );
// }
