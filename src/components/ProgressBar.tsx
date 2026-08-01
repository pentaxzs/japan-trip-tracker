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
    <div className="px-[16px] py-[10px]">
      <div className="flex items-center justify-between mb-[8px]">
        <span
          className="text-caption"
          style={{ color: "var(--ink)", fontWeight: 700 }}
        >
          진행률 {progress}%
        </span>
        <span
          className="text-caption"
          style={{ color: "var(--ink)", fontWeight: 600 }}
        >
          {completedCount}/{totalCount} 완료
        </span>
      </div>
      <div
        className="w-full overflow-hidden"
        style={{
          height: "12px",
          backgroundColor: "var(--canvas)",
          border: "2px solid var(--ink)",
          borderRadius: "0px",
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
