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
    <div className="px-[16px] py-[8px]">
      <div className="flex items-center justify-between mb-[6px]">
        <span
          className="text-caption"
          style={{ color: "var(--muted)" }}
        >
          진행률
        </span>
        <span
          className="text-caption"
          style={{ color: "var(--muted)" }}
        >
          {completedCount}/{totalCount} 완료
        </span>
      </div>
      <div
        className="w-full h-1.5 overflow-hidden"
        style={{
          backgroundColor: "var(--surface-strong)",
          borderRadius: "9999px",
        }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--mode-accent)",
            borderRadius: "9999px",
          }}
        />
      </div>
    </div>
  );
}
