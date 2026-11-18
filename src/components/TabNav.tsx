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
      className="flex sticky top-0 z-50 px-[16px]"
      style={{ backgroundColor: "var(--paper)" }}
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
            className="flex-1 text-nav-link transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              // 글자 + 꽉 찬 밑줄. 밑줄은 검정이다 — 바로 아래 날차 띠는
              // 날마다 색이 바뀌므로 거기 묶으면 2일차부터 색이 싸운다.
              padding: "13px 0 12px",
              color: isActive ? "var(--mode-tab-fg)" : "var(--muted)",
              fontWeight: isActive ? 800 : 600,
              borderBottom: `4px solid ${
                isActive ? "var(--mode-tab-indicator)" : "var(--hairline)"
              }`,
              whiteSpace: "nowrap",
            }}
          >
            {theme.tabLabel}
          </button>
        );
      })}
    </div>
  );
}
