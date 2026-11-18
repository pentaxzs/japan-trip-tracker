"use client";

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
  progress: number;
}

export default function ProgressBar({
  completedCount,
  totalCount,
  progress,
}: ProgressBarProps) {
  if (totalCount === 0) return null;

  return (
    <div className="px-[16px] py-[6px]">
      <div className="flex items-center justify-between mb-[8px]">
        <span
          className="text-caption"
          style={{ color: "var(--ink)" }}
        >
          진행률 {progress}%
        </span>
        <span
          className="text-caption"
          style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}
        >
          {completedCount}/{totalCount} 완료
        </span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{
          height: "8px",
          backgroundColor: "var(--surface-strong)",
          border: "2px solid var(--ink)",
        }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--mode-accent)",
          }}
        />
      </div>
    </div>
  );
}
