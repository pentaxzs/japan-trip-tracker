"use client";

import { Compass } from "lucide-react";
import { MissionItem } from "@/lib/types";
import MissionCard from "./MissionCard";

interface MissionListProps {
  missions: MissionItem[];
  onToggle: (id: string) => void;
  onNoteChange: (id: string, field: "noteSon" | "noteDad", note: string) => void;
  onDelete: (id: string) => void;
}

export default function MissionList({
  missions,
  onToggle,
  onNoteChange,
  onDelete,
}: MissionListProps) {
  if (missions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-[16px] py-[48px] gap-[16px]">
        <div
          className="w-16 h-16 flex items-center justify-center"
          style={{
            borderRadius: "9999px",
            backgroundColor: "var(--surface-strong)",
          }}
        >
          <Compass size={32} strokeWidth={1.5} style={{ color: "var(--muted)" }} />
        </div>
        <div className="text-center">
          <p className="text-display-md mb-[4px]" style={{ color: "var(--ink)" }}>
            미션이 없어요
          </p>
          <p className="text-body-md" style={{ color: "var(--muted)" }}>
            아래에서 우리만의 순간을 추가해보세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-[16px] pb-[16px]">
      {/* 둘 다 읽는 안내 — 한쪽에게 지시하지 않는다 */}
      <div
        className="mb-[14px] px-[14px] py-[12px]"
        style={{
          backgroundColor: "var(--mode-accent)",
          border: "3px solid var(--ink)",
          color: "var(--on-primary)",
        }}
      >
        <p className="text-title-sm" style={{ fontWeight: 800, marginBottom: "4px" }}>
          다 안 해도 돼요
        </p>
        <p className="text-body-md" style={{ lineHeight: 1.55, opacity: 0.95 }}>
          하루에 한두 개만 꺼내 봐도 충분해요. 순서대로 할 필요도 없고,
          빈칸은 비워둬도 괜찮아요.
        </p>
      </div>

      <div className="flex flex-col gap-[14px]">
        {missions.map((item, i) => (
          <MissionCard
            key={item.id}
            item={item}
            index={i}
            onToggle={onToggle}
            onNoteChange={onNoteChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
