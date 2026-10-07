"use client";

import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { MissionItem, TripMembers } from "@/lib/types";

type NoteField = "noteSon" | "noteDad";

/** 메모 칸 두 개. 붙는 이름은 여행마다 다르다 (아빠/엄마, 윤후/윤완) */
const NOTE_FIELDS: { field: NoteField; member: keyof TripMembers }[] = [
  { field: "noteSon", member: "child" },
  { field: "noteDad", member: "parent" },
];

/** 수정 가능한 필드 — 메모(noteSon/noteDad)는 수정 모드와 무관하게 늘 쓸 수 있다 */
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "var(--canvas)",
  border: "2px solid var(--ink)",
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
  /** 메모 칸에 붙을 이름 */
  members: TripMembers;
  /** 방금 추가된 카드면 바로 수정 모드로 연다 */
  autoEdit?: boolean;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, field: NoteField, note: string) => void;
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
        backgroundColor: item.completed
          ? "var(--mode-complete-bg)"
          : "var(--canvas)",
        border: "3px solid var(--ink)",
        boxShadow: "4px 4px 0 var(--ink)",
      }}
    >
      {/* 머리말 — 순서 · 순간 이름 · 체크 · 수정 */}
      <div
        className="flex items-center gap-[10px] px-[14px] py-[10px]"
        style={{ borderBottom: "3px solid var(--ink)" }}
      >
        <span
          className="flex-shrink-0 flex items-center justify-center text-caption"
          style={{
            width: "26px",
            height: "26px",
            backgroundColor: "var(--mode-accent)",
            color: "var(--on-primary)",
            border: "2px solid var(--ink)",
            fontWeight: 800,
          }}
        >
          {index + 1}
        </span>
        <span className="text-[20px] leading-none" aria-hidden="true">
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
            <h3
              className="flex-1 text-title-sm"
              style={{
                color: item.completed
                  ? "var(--mode-complete-text)"
                  : "var(--ink)",
                fontWeight: 800,
              }}
            >
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
                backgroundColor: item.completed
                  ? "var(--mode-accent)"
                  : "var(--canvas)",
                border: "2px solid var(--ink)",
              }}
            >
              {item.completed && (
                <Check size={14} strokeWidth={3} style={{ color: "var(--on-primary)" }} />
              )}
            </button>

            <button
              onClick={() => setDraft(toDraft(item))}
              aria-label={`${item.moment} 수정`}
              className="flex items-center justify-center transition-all duration-150
                opacity-100 sm:opacity-0 sm:hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "9999px",
                backgroundColor: "var(--surface-strong)",
                color: "var(--muted)",
              }}
            >
              <Pencil size={14} strokeWidth={1.5} style={{ color: "inherit" }} />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-[10px] px-[14px] py-[12px]">
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
            {/* 관점 — 이 순간에 남길 한 줄 */}
            {item.lens && (
              <span
                className="self-start text-caption px-[8px] py-[3px]"
                style={{
                  backgroundColor: "var(--mode-accent-light)",
                  border: "2px solid var(--ink)",
                  color: "var(--ink)",
                  fontWeight: 700,
                }}
              >
                {item.lens}
              </span>
            )}

            {/* 이 순간에 깔아두는 이야기 */}
            {item.story && (
              <p
                className="text-body-md"
                style={{ color: "var(--ink)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
              >
                {item.story}
              </p>
            )}

            {/* 둘이 같이 이야기해볼 질문 */}
            {item.prompt && (
              <p
                className="text-body-md px-[10px] py-[8px]"
                style={{
                  backgroundColor: "var(--mode-bg-soft)",
                  borderLeft: "4px solid var(--mode-accent)",
                  color: "var(--ink)",
                  fontWeight: 600,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.prompt}
              </p>
            )}

            {/* 각자 쓰는 메모 — 한쪽이 다른 쪽을 기록하는 게 아니라 둘 다 쓴다 */}
            <div className="flex flex-col gap-[8px]">
              {NOTE_FIELDS.map(({ field, member }) => (
                <label key={field} className="flex flex-col gap-[4px]">
                  <span
                    className="self-start text-caption px-[6px] py-[2px]"
                    style={{
                      backgroundColor: "var(--mode-accent)",
                      color: "var(--on-primary)",
                      fontWeight: 700,
                    }}
                  >
                    {members[member]} ✎
                  </span>
                  <textarea
                    value={item[field]}
                    onChange={(e) => onNoteChange(item.id, field, e.target.value)}
                    placeholder="내 생각 적어두기"
                    rows={2}
                    maxLength={1000}
                    className="w-full outline-none resize-y transition-colors duration-150"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--mode-accent)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--ink)";
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
