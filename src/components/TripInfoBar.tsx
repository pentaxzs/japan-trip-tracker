"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { Calendar, Cloud, Archive } from "lucide-react";
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
  /** 헤더를 없애면서 아카이브 진입을 이 줄로 옮겼다 */
  onOpenArchive?: () => void;
}

export default function TripInfoBar({
  destination,
  departureDate,
  returnDate,
  onDestinationChange,
  onDepartureDateChange,
  onReturnDateChange,
  onOpenArchive,
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
      className="px-[16px] pt-[16px] pb-[10px] flex flex-col gap-[6px]"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* 1행 — 도시 · 날씨 · 아카이브 */}
      <div className="flex items-center gap-[8px]">
        <div className="flex items-center gap-[2px] min-w-0">
          <select
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            aria-label="여행지"
            className="text-display-sm bg-transparent border-none outline-none cursor-pointer -ml-[2px]"
            style={{ color: "var(--ink)" }}
          >
            {JAPAN_CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <span className="flex-1" />

        <div className="flex items-center gap-[4px]">
          {weatherLoading ? (
            <span className="text-caption-sm" style={{ color: "var(--muted)" }}>
              …
            </span>
          ) : weather ? (
            <>
              <span className="text-caption-sm" aria-hidden="true">
                {weather.icon}
              </span>
              <span className="text-caption" style={{ color: "var(--muted)" }}>
                {weather.temp}°
              </span>
            </>
          ) : (
            <Cloud size={14} style={{ color: "var(--muted)" }} aria-label="날씨 정보 없음" />
          )}
        </div>

        {onOpenArchive && (
          <button
            onClick={onOpenArchive}
            aria-label="여행 아카이브"
            className="flex items-center justify-center flex-shrink-0 ml-[2px]"
            style={{ width: "30px", height: "30px", color: "var(--muted)" }}
          >
            <Archive size={17} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* 2행 — 날짜와 기간. 눌러서 고친다 */}
      <div className="flex items-center gap-[5px] text-caption" style={{ color: "var(--muted)" }}>
        <button
          type="button"
          onClick={() => depRef.current?.showPicker?.()}
          className="relative flex items-center gap-[3px]"
          style={{ color: departureDate ? "var(--muted)" : "var(--ink)" }}
        >
          <input
            ref={depRef}
            type="date"
            value={departureDate ?? ""}
            onChange={(e) => onDepartureDateChange(e.target.value || null)}
            aria-label="출발일"
            className="date-input absolute inset-0 opacity-0 cursor-pointer"
            style={{ width: "100%", height: "100%" }}
          />
          {departureDate
            ? `${departureDate.slice(5).replace("-", ".")}(${getWeekday(departureDate)})`
            : "출발일"}
          {!departureDate && <Calendar size={13} />}
        </button>

        <span aria-hidden="true">–</span>

        <button
          type="button"
          onClick={() => retRef.current?.showPicker?.()}
          className="relative flex items-center gap-[3px]"
          style={{ color: returnDate ? "var(--muted)" : "var(--ink)" }}
        >
          <input
            ref={retRef}
            type="date"
            value={returnDate ?? ""}
            onChange={(e) => onReturnDateChange(e.target.value || null)}
            aria-label="귀국일"
            className="date-input absolute inset-0 opacity-0 cursor-pointer"
            style={{ width: "100%", height: "100%" }}
          />
          {returnDate
            ? `${returnDate.slice(5).replace("-", ".")}(${getWeekday(returnDate)})`
            : "귀국일"}
          {!returnDate && <Calendar size={13} />}
        </button>

        {duration && (
          <>
            <span aria-hidden="true">·</span>
            <span>{duration}</span>
          </>
        )}
      </div>
    </div>
  );
}
