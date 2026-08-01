"use client";

import { TripPhase } from "@/lib/types";
import { PHASE_THEMES } from "@/constants/themes";

interface HeroSectionProps {
  phase: TripPhase;
  departureDate: string | null;
  returnDate: string | null;
}

function getDdayMessage(
  phase: TripPhase,
  departureDate: string | null,
  returnDate: string | null
): string | null {
  if (!departureDate || !returnDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dep = new Date(departureDate);
  dep.setHours(0, 0, 0, 0);
  const ret = new Date(returnDate);
  ret.setHours(0, 0, 0, 0);

  const diffToDep = Math.ceil((dep.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const diffFromRet = Math.ceil((today.getTime() - ret.getTime()) / (1000 * 60 * 60 * 24));
  const tripDay = Math.ceil((today.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (phase === "before") {
    if (diffToDep > 0) return `여행까지 D-${diffToDep}일`;
    if (diffToDep === 0) return "오늘 출발이에요!";
    return null;
  }

  if (phase === "during") {
    if (today >= dep && today <= ret) return `여행 ${tripDay}일째!`;
    return null;
  }

  if (phase === "after") {
    if (diffFromRet >= 0) return `여행 다녀온 지 ${diffFromRet === 0 ? 1 : diffFromRet}일째!`;
    return null;
  }

  return null;
}

export default function HeroSection({ phase, departureDate, returnDate }: HeroSectionProps) {
  const theme = PHASE_THEMES[phase];
  const ddayMessage = getDdayMessage(phase, departureDate, returnDate);

  return (
    <div className="px-[16px] py-[24px] text-center">
      <div className="text-[40px] mb-[12px] inline-block" aria-hidden="true">
        {theme.heroEmoji}
      </div>
      <h1 className="text-display-xl mb-[8px]" style={{ color: "var(--ink)" }}>
        {theme.heroTitle}
      </h1>
      <p className="text-body-md" style={{ color: "var(--muted)" }}>
        {theme.heroSubtitle}
      </p>
      {ddayMessage && (
        <p
          className="text-title-md mt-[10px] inline-block px-[14px] py-[4px]"
          style={{
            color: "#ffffff",
            fontWeight: 800,
            backgroundColor: "#FF3366",
            border: "2px solid var(--ink)",
            fontSize: "16px",
          }}
        >
          {ddayMessage}
        </p>
      )}
    </div>
  );
}
