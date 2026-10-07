"use client";

import { TabKey, TAB_KEYS, TAB_THEMES } from "@/constants/themes";

interface TabNavProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function TabNav({ currentTab, onTabChange }: TabNavProps) {
  return (
    <div
      role="tablist"
      aria-label="여행 단계 및 미션 선택"
      className="flex sticky top-0 z-50"
      style={{
        backgroundColor: "var(--canvas)",
        borderBottom: "3px solid var(--ink)",
      }}
    >
      {TAB_KEYS.map((tabKey) => {
        const isActive = tabKey === currentTab;
        const theme = TAB_THEMES[tabKey];

        return (
          <button
            key={tabKey}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tabKey)}
            className="flex-1 h-12 relative text-nav-link transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              color: isActive ? "var(--mode-tab-fg)" : "var(--muted)",
              fontWeight: isActive ? 800 : 500,
              backgroundColor: isActive ? "var(--mode-tab-bg)" : "transparent",
              textTransform: "uppercase",
              fontSize: "16px",
              letterSpacing: "0.2px",
              whiteSpace: "nowrap",
            }}
          >
            {theme.tabLabel}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0"
                style={{ height: "3px", backgroundColor: "var(--mode-tab-indicator)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
