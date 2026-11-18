"use client";

import { useState, type CSSProperties } from "react";
import { Compass, Plus, Pencil, Download, X } from "lucide-react";
import { MissionItem, TripMember, MAX_MEMBERS } from "@/lib/types";
import {
  NIGHT_PRESETS,
  MIN_NIGHTS,
  MAX_NIGHTS,
  nightsLabel,
  clampNights,
} from "@/lib/trip";
import { dayColor } from "@/constants/themes";
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
  newMissionId: string | null;
  /** 설정된 기간 (박) */
  nights: number;
  onNightsChange: (nights: number) => void;
  members: TripMember[];
  onMembersChange: (members: TripMember[]) => void;
  onOpenImport: () => void;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, memberId: string, note: string) => void;
  onEdit: (id: string, draft: MissionDraft) => void;
  onAdd: (day: number) => void;
  onDelete: (id: string) => void;
}

/**
 * 보여줄 날차 목록.
 * 설정한 기간만큼 펼치되, 기간을 줄였을 때 범위 밖에 남은 카드가
 * 사라지면 안 되므로 카드가 들어있는 날차는 항상 포함한다.
 */
function resolveDays(missions: MissionItem[], dayCount: number): number[] {
  const days = new Set<number>();
  for (let d = 1; d <= dayCount; d++) days.add(d);
  for (const m of missions) days.add(m.day);
  return [...days].sort((a, b) => a - b);
}

export default function MissionList({
  missions,
  departureDate,
  newMissionId,
  nights,
  onNightsChange,
  members,
  onMembersChange,
  onOpenImport,
  onToggle,
  onNoteChange,
  onEdit,
  onAdd,
  onDelete,
}: MissionListProps) {
  const days = resolveDays(missions, nights + 1);
  const [draft, setDraft] = useState<TripMember[] | null>(null);
  // 참여자와 기간은 여행 시작할 때 한 번 정하면 끝이라 평소엔 접어둔다.
  // 펼쳐두면 탭에서 첫 카드까지 가는 길에 블록이 세 개나 끼어든다.
  const [setupOpen, setSetupOpen] = useState(false);

  const saveMembers = () => {
    if (!draft) return;
    // 이름을 비운 사람은 빼고, 전부 비었으면 원래대로 둔다
    const cleaned = draft
      .map((m) => ({ ...m, name: m.name.trim() }))
      .filter((m) => m.name);
    onMembersChange(cleaned.length > 0 ? cleaned : members);
    setDraft(null);
  };

  const memberEditor = draft && (
    <div
      className="flex flex-col gap-[8px] px-[12px] py-[12px]"
      style={{ border: "2px solid var(--ink)", backgroundColor: "var(--canvas)" }}
    >
      <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 700 }}>
        이번 여행은 누구랑 (최대 {MAX_MEMBERS}명)
      </span>

      {draft.map((member, i) => (
        <div key={member.id} className="flex items-center gap-[8px]">
          <span
            className="flex-shrink-0 flex items-center justify-center text-caption"
            style={{
              width: "24px",
              height: "24px",
              border: "2px solid var(--ink)",
              backgroundColor: "var(--mode-accent)",
              color: "var(--on-primary)",
              fontWeight: 800,
            }}
          >
            {i + 1}
          </span>
          <input
            type="text"
            value={member.name}
            onChange={(e) =>
              setDraft(draft.map((x) => (x.id === member.id ? { ...x, name: e.target.value } : x)))
            }
            placeholder="이름 (아빠, 엄마, 윤후…)"
            aria-label={`${i + 1}번째 참여자 이름`}
            maxLength={30}
            className="flex-1 outline-none"
            style={{
              padding: "8px 10px",
              backgroundColor: "var(--canvas)",
              border: "2px solid var(--ink)",
              fontSize: "16px",
              color: "var(--ink)",
            }}
          />
          {draft.length > 1 && (
            <button
              onClick={() => setDraft(draft.filter((x) => x.id !== member.id))}
              aria-label={`${member.name || i + 1} 빼기`}
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "9999px",
                backgroundColor: "var(--surface-strong)",
                color: "var(--muted)",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {draft.length < MAX_MEMBERS && (
        <button
          onClick={() =>
            setDraft([...draft, { id: crypto.randomUUID(), name: "" }])
          }
          className="flex items-center justify-center gap-[5px] h-[40px] text-caption"
          style={{
            border: "2px dashed var(--ink)",
            backgroundColor: "var(--canvas)",
            color: "var(--ink)",
            fontWeight: 700,
          }}
        >
          <Plus size={14} strokeWidth={3} />
          한 명 더
        </button>
      )}

      <p className="text-caption" style={{ color: "var(--muted)" }}>
        빼면 그 사람이 쓴 메모도 카드에서 안 보입니다
      </p>

      <div className="flex justify-end gap-[8px]">
        <button
          onClick={() => setDraft(null)}
          className="px-[14px] h-[40px] text-button-md"
          style={{ border: "2px solid var(--ink)", backgroundColor: "var(--canvas)", color: "var(--ink)" }}
        >
          취소
        </button>
        <button
          onClick={saveMembers}
          className="px-[14px] h-[40px] text-button-md"
          style={{
            border: "2px solid var(--ink)",
            backgroundColor: "var(--mode-accent)",
            color: "var(--on-primary)",
            fontWeight: 700,
          }}
        >
          저장
        </button>
      </div>
    </div>
  );

  const [customOpen, setCustomOpen] = useState(false);
  const [customNights, setCustomNights] = useState(String(nights));

  const applyCustom = () => {
    const parsed = Number(customNights);
    if (Number.isFinite(parsed)) onNightsChange(clampNights(parsed));
    setCustomOpen(false);
  };

  const durationRow = (
    <div className="mb-[14px] flex flex-col gap-[6px]">
      <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 700 }}>
        기간 · {nightsLabel(nights)}
      </span>
      <div className="flex flex-wrap gap-[6px]">
        {NIGHT_PRESETS.map((n) => {
          const active = n === nights && !customOpen;
          return (
            <button
              key={n}
              onClick={() => {
                setCustomOpen(false);
                onNightsChange(n);
              }}
              aria-pressed={active}
              className="flex-1 h-[36px] text-caption"
              style={{
                minWidth: "62px",
                border: "2px solid var(--ink)",
                backgroundColor: active ? "var(--mode-accent)" : "var(--canvas)",
                color: active ? "var(--on-primary)" : "var(--ink)",
                fontWeight: 700,
              }}
            >
              {nightsLabel(n)}
            </button>
          );
        })}
        <button
          onClick={() => {
            setCustomNights(String(nights));
            setCustomOpen(!customOpen);
          }}
          aria-pressed={customOpen || !NIGHT_PRESETS.includes(nights)}
          className="flex-1 h-[36px] text-caption"
          style={{
            minWidth: "62px",
            border: "2px solid var(--ink)",
            backgroundColor:
              customOpen || !NIGHT_PRESETS.includes(nights)
                ? "var(--mode-accent)"
                : "var(--canvas)",
            color:
              customOpen || !NIGHT_PRESETS.includes(nights)
                ? "var(--on-primary)"
                : "var(--ink)",
            fontWeight: 700,
          }}
        >
          직접 입력
        </button>
      </div>

      {customOpen && (
        <div className="flex items-center gap-[8px]">
          <input
            type="number"
            inputMode="numeric"
            value={customNights}
            onChange={(e) => setCustomNights(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCustom()}
            min={MIN_NIGHTS}
            max={MAX_NIGHTS}
            aria-label="몇 박인지 입력"
            className="outline-none"
            style={{
              width: "72px",
              padding: "8px 10px",
              backgroundColor: "var(--canvas)",
              border: "2px solid var(--ink)",
              fontSize: "16px",
              color: "var(--ink)",
            }}
          />
          <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 600 }}>
            박 ({MIN_NIGHTS}~{MAX_NIGHTS})
          </span>
          <span className="flex-1" />
          <button
            onClick={applyCustom}
            className="px-[14px] h-[36px] text-caption"
            style={{
              border: "2px solid var(--ink)",
              backgroundColor: "var(--mode-accent)",
              color: "var(--on-primary)",
              fontWeight: 700,
            }}
          >
            적용
          </button>
        </div>
      )}
    </div>
  );

  const memberRow = draft ? memberEditor : (
    <button
      onClick={() => setDraft(members)}
      className="flex items-center gap-[6px] text-caption self-start"
      style={{ color: "var(--ink)" }}
    >
      <Pencil size={13} strokeWidth={2.4} style={{ color: "var(--muted)" }} />
      참여자 — {members.map((m) => m.name).join(" · ")}
    </button>
  );

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
        <button
          onClick={onOpenImport}
          className="flex items-center gap-[5px] px-[12px] h-[40px] text-button-md"
          style={{
            border: "2px solid var(--ink)",
            backgroundColor: "var(--canvas)",
            color: "var(--ink)",
            fontWeight: 700,
          }}
        >
          <Download size={14} strokeWidth={2.5} style={{ color: "inherit" }} />
          지난 여행에서 가져오기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-[16px] pb-[28px] pt-[4px]">
      {/* 설정 — 참여자 · 기간. 평소엔 요약 한 줄 */}
      {setupOpen ? (
        <div className="mb-[14px] flex flex-col gap-[12px]">
          {memberRow}
          {durationRow}
          <button
            onClick={() => setSetupOpen(false)}
            className="self-start text-caption"
            style={{ color: "var(--muted)" }}
          >
            접기
          </button>
        </div>
      ) : (
        <div className="mb-[14px] flex items-center gap-[8px]">
          <button
            onClick={() => setSetupOpen(true)}
            aria-expanded={false}
            className="flex items-center gap-[6px] text-caption min-w-0"
            style={{ color: "var(--ink)" }}
          >
            <Pencil size={13} strokeWidth={2.4} style={{ color: "var(--muted)", flexShrink: 0 }} />
            <span className="truncate">
              {members.map((m) => m.name).join(" · ")}
            </span>
            <span style={{ color: "var(--muted)" }}>· {nightsLabel(nights)}</span>
          </button>
          <span className="flex-1" />
          <button
            onClick={onOpenImport}
            aria-label="지난 여행에서 카드 가져오기"
            className="flex items-center gap-[5px] text-caption flex-shrink-0"
            style={{ color: "var(--muted)" }}
          >
            <Download size={13} strokeWidth={2.4} style={{ color: "inherit" }} />
            지난 여행
          </button>
        </div>
      )}

      {days.map((day) => {
        const items = missions.filter((m) => m.day === day);
        const done = items.filter((m) => m.completed).length;
        const dateLabel = dayDateLabel(departureDate, day);
        const color = dayColor(day);

        return (
          // accent를 섹션에 덮어쓰면 헤더 칩부터 카드 안쪽까지 한 번에 따라간다
          <section
            key={day}
            className="mb-[22px] last:mb-0"
            style={
              {
                "--mode-accent": color.accent,
                "--mode-accent-light": color.light,
              } as CSSProperties
            }
          >
            {/* 날차 헤더 — 화면을 가로지르는 색띠. 스크롤 중 위치가 바로 보인다 */}
            <div
              className="flex items-center gap-[9px] px-[16px] py-[10px] mb-[14px] -mx-[16px]"
              style={{ backgroundColor: color.accent, color: "var(--on-primary)" }}
            >
              <h2 className="text-title-md" style={{ fontWeight: 900 }}>
                {day}일차
              </h2>
              {dateLabel && (
                <span className="text-caption-sm" style={{ opacity: 0.82 }}>
                  {dateLabel}
                </span>
              )}
              <span className="flex-1" />
              {items.length > 0 && (
                <span
                  className="text-caption"
                  style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}
                >
                  {done}/{items.length}
                </span>
              )}
              <button
                onClick={() => onAdd(day)}
                aria-label={`${day}일차에 순간 추가`}
                className="flex items-center justify-center transition-all duration-150 active:scale-[0.95]"
                style={{ width: "28px", height: "28px", color: "var(--on-primary)" }}
              >
                <Plus size={19} strokeWidth={3} style={{ color: "inherit" }} />
              </button>
            </div>

            {items.length === 0 ? (
              <p
                className="text-body-sm px-[14px] py-[18px] text-center"
                style={{ color: "var(--muted)", border: "2px dashed var(--hairline)" }}
              >
                아직 비어 있어요. + 로 추가해보세요
              </p>
            ) : (
              <div className="flex flex-col gap-[16px]">
                {items.map((item, i) => (
                  <MissionCard
                    key={item.id}
                    item={item}
                    index={i}
                    days={days}
                    members={members}
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
