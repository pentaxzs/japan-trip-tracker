"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { MissionItem } from "@/lib/types";

interface MissionCardProps {
  item: MissionItem;
  index: number;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
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
              : `${item.moment} 대화 완료 체크`
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

        {/* 아이에게 던질 질문 / 미션 */}
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

        {/* 아이 대답 메모 */}
        <label className="flex flex-col gap-[4px]">
          <span
            className="text-caption"
            style={{ color: "var(--muted)", fontWeight: 700 }}
          >
            ✎ 아이가 뭐라고 했나
          </span>
          <textarea
            value={item.note}
            onChange={(e) => onNoteChange(item.id, e.target.value)}
            placeholder="들은 그대로 적어두면 나중에 다시 읽기 좋아요"
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
      </div>
    </article>
  );
}
