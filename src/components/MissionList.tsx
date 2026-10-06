"use client";

import { Compass, Plus } from "lucide-react";
import { MissionItem } from "@/lib/types";
import MissionCard, { MissionDraft } from "./MissionCard";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 출발일 기준 N일차의 날짜 라벨. 출발일이 없으면 날짜를 생략한다. */
function dayDateLabel(departureDate: string | null, day: number): string | null {
  if (!departureDate) return null;
  const d = new Date(departureDate);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + day - 1);
  return `${d.getMonth() + 1}.${d.getDate()}(${WEEKDAYS[d.getDay()]})`;
}

interface MissionListProps {
  missions: MissionItem[];
  departureDate: string | null;
  returnDate: string | null;
  newMissionId: string | null;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, field: "noteSon" | "noteDad", note: string) => void;
  onEdit: (id: string, draft: MissionDraft) => void;
  onAdd: (day: number) => void;
  onDelete: (id: string) => void;
}

/**
 * 보여줄 날차 목록.
 * 여행 날짜가 있으면 그 기간을, 없으면 3일을 기본으로 두고,
 * 카드가 실제로 들어있는 날차는 범위 밖이라도 빠뜨리지 않는다.
 */
function resolveDays(
  missions: MissionItem[],
  departureDate: string | null,
  returnDate: string | null
): number[] {
  let span = 3;
  if (departureDate && returnDate) {
    const dep = new Date(departureDate);
    const ret = new Date(returnDate);
    if (!Number.isNaN(dep.getTime()) && !Number.isNaN(ret.getTime())) {
      const diff = Math.round((ret.getTime() - dep.getTime()) / 86400000) + 1;
      if (diff >= 1) span = Math.min(diff, 14);
    }
  }
  const days = new Set<number>();
  for (let d = 1; d <= span; d++) days.add(d);
  for (const m of missions) days.add(m.day);
  return [...days].sort((a, b) => a - b);
}

export default function MissionList({
  missions,
  departureDate,
  returnDate,
  newMissionId,
  onToggle,
  onNoteChange,
  onEdit,
  onAdd,
  onDelete,
}: MissionListProps) {
  const days = resolveDays(missions, departureDate, returnDate);

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
            날차 옆 + 를 눌러 우리만의 순간을 추가해보세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-[16px] pb-[24px]">
      {/* 둘 다 읽는 안내 — 한쪽에게 지시하지 않는다 */}
      <div
        className="mb-[16px] px-[14px] py-[12px]"
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

      {days.map((day) => {
        const items = missions.filter((m) => m.day === day);
        const done = items.filter((m) => m.completed).length;
        const dateLabel = dayDateLabel(departureDate, day);

        return (
          <section key={day} className="mb-[22px] last:mb-0">
            {/* 날차 헤더 — 구분선 겸 추가 버튼 */}
            <div
              className="flex items-center gap-[8px] py-[8px] mb-[12px]"
              style={{ borderBottom: "3px solid var(--ink)" }}
            >
              <span
                className="px-[10px] py-[3px] text-title-sm"
                style={{
                  backgroundColor: "var(--mode-accent)",
                  color: "var(--on-primary)",
                  border: "2px solid var(--ink)",
                  fontWeight: 800,
                }}
              >
                {day}일차
              </span>
              {dateLabel && (
                <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 600 }}>
                  {dateLabel}
                </span>
              )}
              <span className="flex-1" />
              {items.length > 0 && (
                <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 700 }}>
                  {done}/{items.length}
                </span>
              )}
              <button
                onClick={() => onAdd(day)}
                aria-label={`${day}일차에 순간 추가`}
                className="flex items-center justify-center transition-all duration-150 active:scale-[0.95]"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "var(--canvas)",
                  border: "2px solid var(--ink)",
                  color: "var(--ink)",
                }}
              >
                <Plus size={16} strokeWidth={3} style={{ color: "inherit" }} />
              </button>
            </div>

            {items.length === 0 ? (
              <p
                className="text-body-md px-[14px] py-[16px] text-center"
                style={{
                  color: "var(--muted)",
                  border: "2px dashed var(--hairline)",
                }}
              >
                아직 비어 있어요. + 로 추가해보세요
              </p>
            ) : (
              <div className="flex flex-col gap-[14px]">
                {items.map((item, i) => (
                  <MissionCard
                    key={item.id}
                    item={item}
                    index={i}
                    days={days}
                    autoEdit={item.id === newMissionId}
                    onToggle={onToggle}
                    onNoteChange={onNoteChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
