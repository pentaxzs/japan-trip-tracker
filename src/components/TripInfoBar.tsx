"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { MapPin, Calendar, Cloud } from "lucide-react";
import { WeatherData } from "@/lib/types";

export const JAPAN_CITIES = [
  { value: "tokyo", label: "도쿄", nameEn: "Tokyo" },
  { value: "osaka", label: "오사카", nameEn: "Osaka" },
  { value: "kyoto", label: "교토", nameEn: "Kyoto" },
  { value: "fukuoka", label: "후쿠오카", nameEn: "Fukuoka" },
  { value: "sapporo", label: "삿포로", nameEn: "Sapporo" },
  { value: "nagoya", label: "나고야", nameEn: "Nagoya" },
  { value: "yokohama", label: "요코하마", nameEn: "Yokohama" },
  { value: "okinawa", label: "오키나와", nameEn: "Okinawa" },
  { value: "hiroshima", label: "히로시마", nameEn: "Hiroshima" },
  { value: "kobe", label: "고베", nameEn: "Kobe" },
];

const WEATHER_ICONS: Record<string, string> = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getWeekday(dateStr: string): string {
  const d = new Date(dateStr);
  return WEEKDAYS[d.getDay()];
}

function calcTripDuration(dep: string, ret: string): string {
  const d1 = new Date(dep);
  const d2 = new Date(ret);
  const diffMs = d2.getTime() - d1.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (nights <= 0) return "";
  return `${nights}박${nights + 1}일`;
}

interface TripInfoBarProps {
  destination: string;
  departureDate: string | null;
  returnDate: string | null;
  onDestinationChange: (dest: string) => void;
  onDepartureDateChange: (date: string | null) => void;
  onReturnDateChange: (date: string | null) => void;
}

export default function TripInfoBar({
  destination,
  departureDate,
  returnDate,
  onDestinationChange,
  onDepartureDateChange,
  onReturnDateChange,
}: TripInfoBarProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const depRef = useRef<HTMLInputElement>(null);
  const retRef = useRef<HTMLInputElement>(null);
  const city = JAPAN_CITIES.find((c) => c.value === destination) ?? JAPAN_CITIES[0];

  const fetchWeather = useCallback(async (cityName: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`https://wttr.in/${cityName}?format=j1`);
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      const current = data.current_condition?.[0];
      if (current) {
        const desc = current.weatherDesc?.[0]?.value ?? "";
        const mainCondition = Object.keys(WEATHER_ICONS).find((key) =>
          desc.toLowerCase().includes(key.toLowerCase())
        );
        setWeather({
          temp: parseInt(current.temp_C, 10),
          description: desc,
          icon: WEATHER_ICONS[mainCondition ?? ""] ?? "🌤️",
        });
      }
    } catch {
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(city.nameEn);
  }, [city.nameEn, fetchWeather]);

  const duration =
    departureDate && returnDate ? calcTripDuration(departureDate, returnDate) : null;

  return (
    <div
      className="px-[16px] py-[12px] flex flex-col gap-[10px]"
      style={{
        backgroundColor: "var(--canvas)",
        borderBottom: "3px solid var(--ink)",
      }}
    >
      {/* Row 1: Destination + Weather */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <MapPin size={16} style={{ color: "var(--mode-accent)" }} />
          <select
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="text-title-md bg-transparent border-none outline-none cursor-pointer"
            style={{ color: "var(--ink)" }}
          >
            {JAPAN_CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Today's Weather */}
        <div className="flex items-center gap-[6px]">
          <span className="text-caption" style={{ color: "var(--muted)" }}>
            오늘의 {city.label} 날씨
          </span>
          {weatherLoading ? (
            <span className="text-caption" style={{ color: "var(--muted)" }}>
              ...
            </span>
          ) : weather ? (
            <>
              <span className="text-base">{weather.icon}</span>
              <span className="text-title-md" style={{ color: "var(--ink)" }}>
                {weather.temp}°C
              </span>
            </>
          ) : (
            <Cloud size={16} style={{ color: "var(--muted)" }} />
          )}
        </div>
      </div>

      {/* Row 2: Date Range + Duration */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          {/* Departure: 날짜(요일)📅 */}
          <div
            className="relative flex items-center gap-[2px] cursor-pointer"
            onClick={() => depRef.current?.showPicker?.()}
          >
            <input
              ref={depRef}
              type="date"
              value={departureDate ?? ""}
              onChange={(e) => onDepartureDateChange(e.target.value || null)}
              className="date-input absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: "100%", height: "100%" }}
            />
            <span className="text-body-sm" style={{ color: departureDate ? "var(--ink)" : "var(--muted)" }}>
              {departureDate ? `${departureDate.replace(/-/g, ".")}(${getWeekday(departureDate)})` : "출발일"}
            </span>
            <Calendar size={14} style={{ color: "var(--muted)" }} />
          </div>

          <span className="text-caption" style={{ color: "var(--muted)" }}>→</span>

          {/* Return: 날짜(요일)📅 */}
          <div
            className="relative flex items-center gap-[2px] cursor-pointer"
            onClick={() => retRef.current?.showPicker?.()}
          >
            <input
              ref={retRef}
              type="date"
              value={returnDate ?? ""}
              onChange={(e) => onReturnDateChange(e.target.value || null)}
              className="date-input absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: "100%", height: "100%" }}
            />
            <span className="text-body-sm" style={{ color: returnDate ? "var(--ink)" : "var(--muted)" }}>
              {returnDate ? `${returnDate.replace(/-/g, ".")}(${getWeekday(returnDate)})` : "귀국일"}
            </span>
            <Calendar size={14} style={{ color: "var(--muted)" }} />
          </div>
        </div>
        {duration && (
          <span
            className="text-caption px-[8px] py-[2px]"
            style={{
              color: "var(--mode-accent)",
              backgroundColor: "var(--surface-strong)",
              borderRadius: "9999px",
              fontWeight: 600,
            }}
          >
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
