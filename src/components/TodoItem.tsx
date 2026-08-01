"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { TodoItem as TodoItemType, TripPhase } from "@/lib/types";
import { PHASE_THEMES } from "@/constants/themes";

interface TodoItemProps {
  item: TodoItemType;
  phase: TripPhase;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export default function TodoItemComponent({
  item,
  phase,
  onToggle,
  onDelete,
  isNew,
}: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [justChecked, setJustChecked] = useState(false);
  const theme = PHASE_THEMES[phase];

  const animationClass = `animate-${theme.animation}`;

  const handleToggle = () => {
    if (!item.completed && theme.animation === "check-pop") {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 300);
    }
    onToggle(item.id);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(item.id), 200);
  };

  return (
    <div
      className={`
        group flex items-center gap-[12px] px-[16px] py-[12px]
        min-h-14
        transition-all duration-150
        ${isNew ? animationClass : ""}
        ${isDeleting ? "todo-item-exit" : ""}
      `}
      style={{
        borderRadius: "0px",
        backgroundColor: item.completed
          ? "var(--mode-complete-bg)"
          : "transparent",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      {/* Checkbox — 24x24, rounded-sm (8px) per Airbnb spec */}
      <button
        onClick={handleToggle}
        role="checkbox"
        aria-checked={item.completed}
        aria-label={item.completed ? "완료 해제" : "완료 체크"}
        className={`
          w-6 h-6 flex-shrink-0
          flex items-center justify-center
          transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${justChecked ? "animate-check-pop" : ""}
        `}
        style={{
          borderRadius: "4px",
          backgroundColor: item.completed
            ? "var(--mode-accent)"
            : "transparent",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderColor: item.completed
            ? "var(--mode-accent)"
            : "var(--border-strong)",
        }}
      >
        {item.completed && (
          <Check size={14} strokeWidth={3} style={{ color: "var(--on-primary)" }} />
        )}
      </button>

      {/* Text — title-sm: 16px/500 */}
      <span
        className={`
          flex-1 text-title-sm transition-colors duration-150
          ${item.completed ? "line-through" : ""}
        `}
        style={{
          color: item.completed
            ? "var(--mode-complete-text)"
            : "var(--ink)",
        }}
      >
        {item.text}
      </span>

      {/* Delete button — icon-button-circle: surface-strong bg, 32px, full round */}
      <button
        onClick={handleDelete}
        aria-label={`${item.text} 삭제`}
        className="
          flex items-center justify-center
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100
          transition-all duration-150
          focus-visible:opacity-100 focus-visible:outline-none
        "
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "9999px",
          backgroundColor: "var(--surface-strong)",
          color: "var(--muted)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--error)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--muted)";
        }}
      >
        <Trash2 size={16} strokeWidth={1.5} style={{ color: "inherit" }} />
      </button>
    </div>
  );
}
