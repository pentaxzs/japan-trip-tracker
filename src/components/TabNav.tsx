"use client";

import { TripPhase } from "@/lib/types";
import { PHASE_THEMES } from "@/constants/themes";

const PHASES: TripPhase[] = ["before", "during", "after"];

interface TabNavProps {
  currentPhase: TripPhase;
  onPhaseChange: (phase: TripPhase) => void;
}

export default function TabNav({ currentPhase, onPhaseChange }: TabNavProps) {
  return (
    <div
      role="tablist"
      aria-label="여행 단계 선택"
      className="flex border-b sticky top-0 z-50"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--hairline)",
      }}
    >
      {PHASES.map((phase) => {
        const isActive = phase === currentPhase;
        const theme = PHASE_THEMES[phase];

        return (
          <button
            key={phase}
            role="tab"
            aria-selected={isActive}
            onClick={() => onPhaseChange(phase)}
            className="flex-1 h-12 relative text-nav-link transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              color: isActive ? "var(--mode-accent)" : "var(--muted)",
              fontWeight: isActive ? 600 : 400,
              backgroundColor: isActive ? "var(--surface-soft)" : "transparent",
            }}
          >
            {theme.tabLabel}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "var(--mode-accent)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
