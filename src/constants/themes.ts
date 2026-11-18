import { TripPhase } from "@/lib/types";

export interface PhaseTheme {
  accent: string;
  accentActive: string;
  accentLight: string;
  accentGlow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroEmoji: string;
  tabLabel: string;
  animation: "slide-in" | "check-pop" | "fade-in";
}

export const PHASE_THEMES: Record<TripPhase, PhaseTheme> = {
  before: {
    accent: "#ff385c",
    accentActive: "#e00b41",
    accentLight: "#ffd1da",
    accentGlow: "#ff6b6b",
    heroTitle: "두근두근! 일본 여행 준비 중",
    heroSubtitle: "설레는 여행의 시작, 하나씩 체크해봐요",
    heroEmoji: "✈️",
    tabLabel: "여행 전",
    animation: "slide-in",
  },
  during: {
    accent: "#F59E0B",
    accentActive: "#D97706",
    accentLight: "#FDE68A",
    accentGlow: "#FBBF24",
    heroTitle: "신나는 일본 여행 중!",
    heroSubtitle: "오늘도 즐거운 하루! 하나씩 정복해봐요",
    heroEmoji: "📸",
    tabLabel: "여행 중",
    animation: "check-pop",
  },
  after: {
    accent: "#7C3AED",
    accentActive: "#6D28D9",
    accentLight: "#DDD6FE",
    accentGlow: "#8B5CF6",
    heroTitle: "즐거웠던 일본 여행,\n마무리해봐요",
    heroSubtitle: "좋은 추억을 차곡차곡 정리해요",
    heroEmoji: "📷",
    tabLabel: "여행 후",
    animation: "fade-in",
  },
};

// --- 탭: 3개 여행 단계 + 미션 ---

/** 투두 단계(TripPhase)에 미션 탭을 더한 상단 탭 키 */
export type TabKey = TripPhase | "mission";

export const TAB_KEYS: TabKey[] = ["before", "during", "after", "mission"];

export const MISSION_THEME: PhaseTheme = {
  accent: "#111114",
  accentActive: "#000000",
  accentLight: "#F0EBE1",
  accentGlow: "#3A3A42",
  heroTitle: "기억들을 남겨봐요",
  heroSubtitle: "같이 보고, 각자 한 줄씩 남겨요",
  heroEmoji: "🧭",
  tabLabel: "미션",
  animation: "fade-in",
};

export const TAB_THEMES: Record<TabKey, PhaseTheme> = {
  ...PHASE_THEMES,
  mission: MISSION_THEME,
};

export function isPhase(tab: TabKey): tab is TripPhase {
  return tab !== "mission";
}

// --- 날차별 색 ---

export interface DayColor {
  /** 칩·배지 배경. 흰 글자가 올라가므로 충분히 어두워야 한다 */
  accent: string;
  /** 관점 뱃지 배경. 검정 글자가 올라간다 */
  light: string;
}

/**
 * 날차를 한눈에 가르는 색. 전부 흰 글자 대비 5:1 이상이고,
 * 색상(hue)과 명도가 둘 다 달라서 색각 이상에서도 구별된다.
 * 네 개를 넘기면 처음부터 다시 돈다.
 */
export const DAY_COLORS: DayColor[] = [
  { accent: "#1F6B4D", light: "#D7E8DF" }, // 1일차 — 포레스트   흰글자 6.5:1
  { accent: "#B5461F", light: "#F4DCD1" }, // 2일차 — 번트오렌지 흰글자 5.5:1
  { accent: "#2B4C8C", light: "#D5DEEE" }, // 3일차 — 네이비     흰글자 8.5:1
  { accent: "#5C2D6B", light: "#E2D6E6" }, // 4일차 — 플럼       흰글자 10.2:1
];

export function dayColor(day: number): DayColor {
  const i = (Math.max(1, day) - 1) % DAY_COLORS.length;
  return DAY_COLORS[i];
}
