"use client";

import { TabKey, TAB_THEMES } from "@/constants/themes";

interface HeroSectionProps {
  tab: TabKey;
  departureDate: string | null;
  returnDate: string | null;
}

function getDdayMessage(
  phase: TabKey,
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

export default function HeroSection({ tab, departureDate, returnDate }: HeroSectionProps) {
  const theme = TAB_THEMES[tab];
  const ddayMessage = getDdayMessage(tab, departureDate, returnDate);

  return (
    /* 리스트가 주인공이라 히어로는 한 줄로 줄였다.
       예전에는 이모지+제목+부제+뱃지가 화면 1/3을 먹어서
       정작 체크할 항목이 스크롤 밖에 있었다. */
    <div className="px-[16px] pt-[12px] pb-[4px] flex items-center gap-[9px]">
      <span className="text-[20px] leading-none flex-shrink-0" aria-hidden="true">
        {theme.heroEmoji}
      </span>
      <h1
        className="text-title-md min-w-0 truncate"
        style={{ color: "var(--ink)" }}
        title={theme.heroTitle}
      >
        {theme.heroTitle.replace(/\n/g, " ")}
      </h1>
      {ddayMessage && (
        <span
          className="text-badge px-[8px] py-[3px] flex-shrink-0 ml-auto"
          style={{
            color: "var(--ink)",
            backgroundColor: "var(--accent)",
            border: "2.5px solid var(--ink)",
          }}
        >
          {ddayMessage}
        </span>
      )}
    </div>
  );
}
