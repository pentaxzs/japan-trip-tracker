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
    heroTitle: "즐거웠던 일본 여행, 마무리해봐요",
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
  accent: "#1F3A93",
  accentActive: "#162C70",
  accentLight: "#BFCCEF",
  accentGlow: "#3B5BC4",
  heroTitle: "아빠와 아들의 도쿄",
  heroSubtitle: "장소마다 딱 하나의 이야기만 남겨요",
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
