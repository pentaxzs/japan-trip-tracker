"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, ChevronDown } from "lucide-react";
import { MissionItem, TripMember } from "@/lib/types";

/** 수정 가능한 필드 — 메모는 수정 모드와 무관하게 늘 쓸 수 있다 */
export type MissionDraft = Pick<
  MissionItem,
  "day" | "moment" | "lens" | "story" | "prompt"
>;

const EDIT_FIELDS: {
  field: keyof MissionDraft;
  label: string;
  placeholder: string;
  multiline: boolean;
}[] = [
  { field: "lens", label: "관점", placeholder: "이 순간에 남길 한 줄", multiline: false },
  { field: "story", label: "이야기", placeholder: "둘이 같이 읽을 배경", multiline: true },
  { field: "prompt", label: "질문", placeholder: "같이 이야기해볼 질문", multiline: true },
];

/** 수정 모드의 입력 — 테두리가 있는 네모 */
const inputStyle = {
  width: "100%",
  padding: "9px 10px",
  backgroundColor: "var(--canvas)",
  border: "2.5px solid var(--ink)",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "var(--ink)",
} as const;

/** 메모 — 흰 본문 안이라 밑줄만 둔다. 테두리를 또 치면 카드가 액자가 된다 */
const noteStyle = {
  width: "100%",
  padding: "5px 0 7px",
  backgroundColor: "transparent",
  border: "0",
  borderBottom: "2px solid var(--hairline)",
  fontSize: "16px",
  lineHeight: 1.5,
  color: "var(--ink)",
} as const;

function toDraft(item: MissionItem): MissionDraft {
  return {
    day: item.day,
    moment: item.moment,
    lens: item.lens,
    story: item.story,
    prompt: item.prompt,
  };
}

interface MissionCardProps {
  item: MissionItem;
  /** 날차 안에서의 순번 (0부터) */
  index: number;
  /** 선택 가능한 날차 목록 — 수정 모드에서 카드를 옮길 때 쓴다 */
  days: number[];
  /** 메모를 쓰는 사람들 — 한 사람당 칸 하나 */
  members: TripMember[];
  /** 방금 추가된 카드면 바로 수정 모드로 연다 */
  autoEdit?: boolean;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, memberId: string, note: string) => void;
  onEdit: (id: string, draft: MissionDraft) => void;
  onDelete: (id: string) => void;
}

export default function MissionCard({
  item,
  index,
  days,
  members,
  autoEdit,
  onToggle,
  onNoteChange,
  onEdit,
  onDelete,
}: MissionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  // 3명 넘어가면 카드가 화면 하나를 넘어간다 — 메모를 접어둔다
  const collapsible = members.length > 2;
  const [notesOpen, setNotesOpen] = useState(false);
  const showNotes = !collapsible || notesOpen;
  const written = members.filter((m) => (item.notes?.[m.id] ?? "").trim());
  const [draft, setDraft] = useState<MissionDraft | null>(
    autoEdit ? toDraft(item) : null
  );
  const isEditing = draft !== null;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(item.id), 200);
  };

  const handleSave = () => {
    if (!draft) return;
    const moment = draft.moment.trim();
    // 제목까지 비우면 카드가 뭔지 알 수 없어진다 — 원래 제목을 지킨다
    onEdit(item.id, { ...draft, moment: moment || item.moment });
    setDraft(null);
  };

  return (
    <article
      data-no-swipe={isEditing ? "" : undefined}
      className={`flex flex-col transition-all duration-150 ${
        isDeleting ? "todo-item-exit" : ""
      }`}
      style={{
        backgroundColor: "var(--canvas)",
        border: "var(--border-w) solid var(--ink)",
        boxShadow: "var(--shadow-hard)",
      }}
    >
      {/* 머리말 — 날차 색면. 완료하면 채도를 빼서 지나간 것으로 보이게 한다 */}
      <div
        className="flex flex-col gap-[7px] px-[13px] pt-[11px] pb-[12px]"
        style={{
          backgroundColor: "var(--mode-accent)",
          borderBottom: "var(--border-w) solid var(--ink)",
          filter: item.completed ? "saturate(0.2) brightness(1.25)" : undefined,
        }}
      >
      <div className="flex items-center gap-[9px]">
        <span
          className="flex-shrink-0 flex items-center justify-center text-badge"
          style={{
            width: "23px",
            height: "23px",
            backgroundColor: "var(--accent)",
            color: "var(--ink)",
            border: "2.5px solid var(--ink)",
          }}
        >
          {index + 1}
        </span>
        <span className="text-[19px] leading-none" aria-hidden="true">
          {item.emoji}
        </span>

        {isEditing ? (
          <input
            type="text"
            value={draft.moment}
            onChange={(e) => setDraft({ ...draft, moment: e.target.value })}
            aria-label="순간 이름"
            maxLength={100}
            className="flex-1 outline-none"
            style={{ ...inputStyle, padding: "6px 8px", fontWeight: 800 }}
          />
        ) : (
          <>
            <h3 className="flex-1 text-title-sm" style={{ color: "var(--on-primary)" }}>
              {item.moment}
            </h3>

            <button
              onClick={() => onToggle(item.id)}
              role="checkbox"
              aria-checked={item.completed}
              aria-label={
                item.completed
                  ? `${item.moment} 완료 해제`
                  : `${item.moment} 완료 체크`
              }
              className="w-6 h-6 flex-shrink-0 flex items-center justify-center transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "var(--canvas)",
                border: "2.5px solid var(--ink)",
              }}
            >
              {item.completed && (
                <Check size={13} strokeWidth={3.5} style={{ color: "var(--ink)" }} />
              )}
            </button>

            <button
              onClick={() => setDraft(toDraft(item))}
              aria-label={`${item.moment} 수정`}
              className="flex items-center justify-center transition-all duration-150
                opacity-100 sm:opacity-0 sm:hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              style={{
                width: "26px",
                height: "26px",
                color: "var(--on-primary)",
                opacity: 0.85,
              }}
            >
              <Pencil size={15} strokeWidth={2.2} style={{ color: "inherit" }} />
            </button>
          </>
        )}
      </div>

      {!isEditing && item.lens && (
        <p className="text-caption-sm" style={{ color: "var(--on-primary)", opacity: 0.88 }}>
          {item.lens}
        </p>
      )}
      </div>

      <div className="flex flex-col gap-[10px] px-[13px] py-[13px]">
        {isEditing ? (
          <>
            <div className="flex flex-col gap-[4px]">
              <span
                className="text-caption"
                style={{ color: "var(--muted)", fontWeight: 700 }}
              >
                날차
              </span>
              <div className="flex gap-[6px]">
                {days.map((d) => {
                  const active = draft.day === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDraft({ ...draft, day: d })}
                      aria-pressed={active}
                      className="flex-1 h-[40px] text-caption"
                      style={{
                        border: "2px solid var(--ink)",
                        backgroundColor: active
                          ? "var(--mode-accent)"
                          : "var(--canvas)",
                        color: active ? "var(--on-primary)" : "var(--ink)",
                        fontWeight: 700,
                      }}
                    >
                      {d}일차
                    </button>
                  );
                })}
              </div>
            </div>

            {EDIT_FIELDS.map(({ field, label, placeholder, multiline }) => (
              <label key={field} className="flex flex-col gap-[4px]">
                <span
                  className="text-caption"
                  style={{ color: "var(--muted)", fontWeight: 700 }}
                >
                  {label}
                </span>
                {multiline ? (
                  <textarea
                    value={draft[field]}
                    onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                    placeholder={placeholder}
                    rows={field === "story" ? 4 : 2}
                    maxLength={1000}
                    className="outline-none resize-y"
                    style={inputStyle}
                  />
                ) : (
                  <input
                    type="text"
                    value={draft[field]}
                    onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                    placeholder={placeholder}
                    maxLength={200}
                    className="outline-none"
                    style={inputStyle}
                  />
                )}
              </label>
            ))}

            <div className="flex items-center justify-between gap-[8px] pt-[2px]">
              <button
                onClick={handleDelete}
                aria-label={`${item.moment} 삭제`}
                className="flex items-center gap-[4px] text-caption px-[10px] h-[40px]"
                style={{
                  border: "2px solid var(--ink)",
                  backgroundColor: "var(--canvas)",
                  color: "var(--error)",
                  fontWeight: 700,
                }}
              >
                <Trash2 size={14} strokeWidth={2} style={{ color: "inherit" }} />
                삭제
              </button>

              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => setDraft(null)}
                  className="text-button-md px-[14px] h-[40px]"
                  style={{
                    border: "2px solid var(--ink)",
                    backgroundColor: "var(--canvas)",
                    color: "var(--ink)",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="text-button-md px-[14px] h-[40px]"
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
          </>
        ) : (
          <>
            {/* 이 순간에 깔아두는 이야기 */}
            {item.story && (
              <p
                className="text-body-md"
                style={{ color: "var(--body-text)", whiteSpace: "pre-wrap" }}
              >
                {item.story}
              </p>
            )}

            {/* 둘이 같이 이야기해볼 질문 */}
            {item.prompt && (
              <p
                className="text-body-md pl-[11px]"
                style={{
                  borderLeft: "4px solid var(--mode-accent)",
                  color: "var(--ink)",
                  fontWeight: 800,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.prompt}
              </p>
            )}

            {/* 각자 쓰는 메모 — 한 사람이 다른 사람을 기록하는 게 아니라 각자 쓴다 */}
            <div className="flex flex-col gap-[8px]">
              {collapsible && (
                <button
                  onClick={() => setNotesOpen(!notesOpen)}
                  aria-expanded={notesOpen}
                  className="flex items-center gap-[6px] px-[10px] h-[40px] text-caption"
                  style={{
                    borderTop: "1px solid var(--hairline)",
                    paddingTop: "10px",
                    backgroundColor: "transparent",
                    color: "var(--ink)",
                  }}
                >
                  <ChevronDown
                    size={14}
                    strokeWidth={3}
                    style={{
                      color: "inherit",
                      transform: notesOpen ? "rotate(180deg)" : "none",
                      transition: "transform 150ms",
                    }}
                  />
                  메모 {written.length}/{members.length}
                  <span
                    className="flex-1 truncate text-left"
                    style={{ color: "var(--muted)", fontWeight: 600 }}
                  >
                    {written.length > 0
                      ? written.map((m) => m.name).join(" · ")
                      : "아직 아무도 안 썼어요"}
                  </span>
                </button>
              )}

              {showNotes &&
                members.map((member) => (
                  <label key={member.id} className="flex flex-col gap-[1px]">
                    <span className="text-caption" style={{ color: "var(--mode-accent)" }}>
                      {member.name}
                    </span>
                    <textarea
                      value={item.notes?.[member.id] ?? ""}
                      onChange={(e) => onNoteChange(item.id, member.id, e.target.value)}
                      placeholder="내 생각 적어두기"
                      rows={2}
                      maxLength={1000}
                      className="w-full outline-none resize-y transition-colors duration-150"
                      style={noteStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderBottomColor = "var(--mode-accent)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderBottomColor = "var(--hairline)";
                      }}
                    />
                  </label>
                ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
