"use client";

import { RefreshCw, Check } from "lucide-react";

/**
 * 탭 바(sticky top-0, 높이 51px)가 가리지 않도록 그 아래에 띄운다.
 * z도 탭 바(z-50)보다 위여야 한다 — 같으면 DOM 순서상 탭 바가 이긴다.
 */
const TOAST_POSITION = "fixed top-[59px] left-1/2 -translate-x-1/2 z-[60] animate-slide-down";

interface UpdateToastProps {
  visible: boolean;
  onRefresh: () => void;
}

export default function UpdateToast({ visible, onRefresh }: UpdateToastProps) {
  if (!visible) return null;

  return (
    <div
      className={TOAST_POSITION}
      style={{ width: "calc(100% - 32px)", maxWidth: "400px" }}
    >
      <div
        className="flex items-center gap-[12px] px-[16px] py-[12px]"
        style={{
          backgroundColor: "var(--ink)",
          color: "var(--canvas)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <span className="text-body-sm flex-1">
          새로운 업데이트가 있습니다
        </span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-[6px] px-[12px] py-[6px] text-button-sm shrink-0"
          style={{
            backgroundColor: "var(--mode-accent, #3b82f6)",
            color: "var(--on-primary, #fff)",
            borderRadius: "8px",
          }}
        >
          <RefreshCw size={14} />
          새로고침
        </button>
      </div>
    </div>
  );
}

interface MergeToastProps {
  visible: boolean;
}

export function MergeToast({ visible }: MergeToastProps) {
  if (!visible) return null;

  return (
    <div
      className={TOAST_POSITION}
      style={{ width: "calc(100% - 32px)", maxWidth: "400px" }}
    >
      <div
        className="flex items-center gap-[10px] px-[16px] py-[12px]"
        style={{
          backgroundColor: "#16a34a",
          color: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <Check size={16} />
        <span className="text-body-sm">
          변경사항을 자동으로 합쳤습니다
        </span>
      </div>
    </div>
  );
}
