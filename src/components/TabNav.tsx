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
      className="flex sticky top-0 z-50"
      style={{
        backgroundColor: "var(--canvas)",
        borderBottom: "3px solid var(--ink)",
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
              color: isActive ? "var(--ink)" : "var(--muted)",
              fontWeight: isActive ? 800 : 500,
              backgroundColor: isActive ? "var(--mode-accent)" : "transparent",
              textTransform: "uppercase",
              fontSize: "18px",
              letterSpacing: "0.5px",
            }}
          >
            {theme.tabLabel}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0"
                style={{ height: "3px", backgroundColor: "var(--ink)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
