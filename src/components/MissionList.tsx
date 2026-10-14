"use client";

import { useState, type CSSProperties } from "react";
import { Compass, Plus, Pencil, Download, X } from "lucide-react";
import { MissionItem, TripMember, MAX_MEMBERS } from "@/lib/types";
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
  returnDate: string | null;
  newMissionId: string | null;
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
  members,
  onMembersChange,
  onOpenImport,
  onToggle,
  onNoteChange,
  onEdit,
  onAdd,
  onDelete,
}: MissionListProps) {
  const days = resolveDays(missions, departureDate, returnDate);
  const [draft, setDraft] = useState<TripMember[] | null>(null);

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

  const memberRow = (
    <div className="mb-[14px]">
      {draft ? (
        memberEditor
      ) : (
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => setDraft(members)}
            className="flex items-center gap-[6px] text-caption min-w-0"
            style={{ color: "var(--ink)", fontWeight: 700 }}
          >
            <Pencil size={13} strokeWidth={2} style={{ color: "var(--muted)", flexShrink: 0 }} />
            <span className="truncate">{members.map((m) => m.name).join(" · ")}</span>
          </button>
          <span className="flex-1" />
          <button
            onClick={onOpenImport}
            className="flex items-center gap-[5px] px-[10px] h-[32px] text-caption flex-shrink-0"
            style={{
              border: "2px solid var(--ink)",
              backgroundColor: "var(--canvas)",
              color: "var(--ink)",
              fontWeight: 700,
            }}
          >
            <Download size={13} strokeWidth={2.5} style={{ color: "inherit" }} />
            지난 여행에서
          </button>
        </div>
      )}
    </div>
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

      {memberRow}

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
            {/* 날차 헤더 — 구분선 겸 추가 버튼 */}
            <div
              className="flex items-center gap-[8px] py-[8px] mb-[12px]"
              style={{ borderBottom: `3px solid ${color.accent}` }}
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
