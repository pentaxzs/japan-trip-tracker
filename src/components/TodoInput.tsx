"use client";

import { useState, KeyboardEvent } from "react";

interface TodoInputProps {
  onAdd: (text: string) => void;
  placeholder?: string;
  addLabel?: string;
}

export default function TodoInput({
  onAdd,
  placeholder = "+ 새 할 일을 입력하세요...",
  addLabel = "할 일 추가",
}: TodoInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-[8px] px-[16px] pt-[12px] pb-[max(16px,env(safe-area-inset-bottom,16px))]">
      {/* text-input: white surface, 1px hairline, 8px radius, 56px height */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={200}
        className="
          flex-1 outline-none
          transition-all duration-150
          focus:ring-2
        "
        style={{
          height: "56px",
          padding: "14px 12px",
          backgroundColor: "var(--canvas)",
          borderRadius: "0px",
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "var(--ink)",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: 1.5,
          color: "var(--ink)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--mode-accent)";
          e.currentTarget.style.borderWidth = "3px";
          e.currentTarget.style.padding = "14px 12px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--ink)";
          e.currentTarget.style.borderWidth = "3px";
          e.currentTarget.style.padding = "14px 12px";
        }}
      />
      {/* button-primary: Rausch fill, white text, 8px radius, 56px height (matches input) */}
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        aria-label={addLabel}
        className="
          flex items-center justify-center
          transition-all duration-150
          hover:brightness-95
          active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
        "
        style={{
          height: "56px",
          minWidth: "56px",
          padding: "14px 24px",
          borderRadius: "0px",
          backgroundColor: "var(--mode-accent)",
          border: "3px solid var(--ink)",
          color: "var(--on-primary)",
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: 1.25,
        }}
      >
        추가
      </button>
    </div>
  );
}
