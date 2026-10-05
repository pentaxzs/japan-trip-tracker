"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { MissionItem } from "@/lib/types";

type NoteField = "noteSon" | "noteDad";

const NOTE_FIELDS: { field: NoteField; who: string; placeholder: string }[] = [
  { field: "noteSon", who: "아들", placeholder: "내 생각 적어두기" },
  { field: "noteDad", who: "아빠", placeholder: "내 생각 적어두기" },
];

interface MissionCardProps {
  item: MissionItem;
  index: number;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, field: NoteField, note: string) => void;
  onDelete: (id: string) => void;
}

export default function MissionCard({
  item,
  index,
  onToggle,
  onNoteChange,
  onDelete,
}: MissionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(item.id), 200);
  };

  return (
    <article
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
      {/* 머리말 — 순서 · 순간 이름 · 체크 */}
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
        <h3
          className="flex-1 text-title-sm"
          style={{
            color: item.completed ? "var(--mode-complete-text)" : "var(--ink)",
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
          onClick={handleDelete}
          aria-label={`${item.moment} 삭제`}
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
          <Trash2 size={14} strokeWidth={1.5} style={{ color: "inherit" }} />
        </button>
      </div>

      <div className="flex flex-col gap-[10px] px-[14px] py-[12px]">
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

        {/* 아빠가 할 이야기 */}
        {item.story && (
          <p
            className="text-body-md"
            style={{ color: "var(--ink)", lineHeight: 1.6 }}
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
            }}
          >
            {item.prompt}
          </p>
        )}

        {/* 각자 쓰는 메모 — 한쪽이 다른 쪽을 기록하는 게 아니라 둘 다 쓴다 */}
        <div className="flex flex-col gap-[8px]">
          {NOTE_FIELDS.map(({ field, who, placeholder }) => (
            <label key={field} className="flex flex-col gap-[4px]">
              <span
                className="self-start text-caption px-[6px] py-[2px]"
                style={{
                  backgroundColor: "var(--mode-accent)",
                  color: "var(--on-primary)",
                  fontWeight: 700,
                }}
              >
                {who} ✎
              </span>
              <textarea
                value={item[field]}
                onChange={(e) => onNoteChange(item.id, field, e.target.value)}
                placeholder={placeholder}
                rows={2}
                maxLength={1000}
                className="w-full outline-none resize-y transition-colors duration-150"
                style={{
                  padding: "10px",
                  backgroundColor: "var(--canvas)",
                  border: "2px solid var(--ink)",
                  fontSize: "16px",
                  lineHeight: 1.5,
                  color: "var(--ink)",
                }}
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
      </div>
    </article>
  );
}
