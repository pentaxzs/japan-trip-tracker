"use client";

import { useEffect, useState } from "react";
import { X, Check, PackageOpen } from "lucide-react";
import { ArchivedTrip, MissionItem } from "@/lib/types";
import { fetchArchive } from "@/lib/storage";
import { JAPAN_CITIES } from "@/components/TripInfoBar";

function cityLabel(destination: string): string {
  return JAPAN_CITIES.find((c) => c.value === destination)?.label ?? destination;
}

function tripDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

interface MissionImportProps {
  onClose: () => void;
  onImport: (picked: MissionItem[]) => void;
}

export default function MissionImport({ onClose, onImport }: MissionImportProps) {
  const [archives, setArchives] = useState<ArchivedTrip[] | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchArchive().then((list) => {
      setArchives(list);
      // 여행이 하나뿐이면 고를 것도 없다
      if (list.length === 1) setTripId(list[0].id);
    });
  }, []);

  const trip = archives?.find((t) => t.id === tripId) ?? null;
  const missions = trip?.missions ?? [];

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleImport = () => {
    onImport(missions.filter((m) => picked.has(m.id)));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] max-h-[85dvh] flex flex-col"
        style={{
          backgroundColor: "var(--canvas)",
          border: "3px solid var(--ink)",
        }}
      >
        {/* 머리말 */}
        <div
          className="flex items-center gap-[10px] px-[16px] py-[12px] flex-shrink-0"
          style={{ borderBottom: "3px solid var(--ink)" }}
        >
          <h2 className="flex-1 text-title-md" style={{ color: "var(--ink)", fontWeight: 800 }}>
            지난 여행에서 가져오기
          </h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              backgroundColor: "var(--surface-strong)",
              color: "var(--muted)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[16px] py-[14px]">
          {archives === null ? (
            <p className="text-body-md py-[24px] text-center" style={{ color: "var(--muted)" }}>
              불러오는 중...
            </p>
          ) : archives.length === 0 ? (
            <div className="flex flex-col items-center gap-[12px] py-[32px]">
              <PackageOpen size={32} strokeWidth={1.5} style={{ color: "var(--muted)" }} />
              <p className="text-body-md text-center" style={{ color: "var(--muted)" }}>
                아직 아카이브된 여행이 없어요.
                <br />
                여행을 종료하면 여기에 쌓입니다.
              </p>
            </div>
          ) : (
            <>
              {/* 여행 고르기 — 하나뿐이면 이미 골라져 있다 */}
              {archives.length > 1 && (
                <div className="flex flex-col gap-[8px] mb-[16px]">
                  <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 700 }}>
                    어느 여행에서
                  </span>
                  {archives.map((t) => {
                    const active = t.id === tripId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTripId(t.id);
                          setPicked(new Set());
                        }}
                        aria-pressed={active}
                        className="flex items-center gap-[8px] px-[12px] py-[10px] text-left"
                        style={{
                          border: "2px solid var(--ink)",
                          backgroundColor: active ? "var(--mode-accent)" : "var(--canvas)",
                          color: active ? "var(--on-primary)" : "var(--ink)",
                        }}
                      >
                        <span className="text-body-md" style={{ fontWeight: 700 }}>
                          {cityLabel(t.tripInfo.destination)}
                        </span>
                        <span className="text-caption" style={{ opacity: 0.8 }}>
                          {tripDate(t.archivedAt)} · 미션 {t.missions?.length ?? 0}장
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {trip && missions.length === 0 && (
                <p className="text-body-md py-[24px] text-center" style={{ color: "var(--muted)" }}>
                  이 여행에는 미션이 없어요
                </p>
              )}

              {missions.length > 0 && (
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between">
                    <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 700 }}>
                      가져올 카드 고르기
                    </span>
                    <button
                      onClick={() =>
                        setPicked(
                          picked.size === missions.length
                            ? new Set()
                            : new Set(missions.map((m) => m.id))
                        )
                      }
                      className="text-caption"
                      style={{ color: "var(--mode-accent)", fontWeight: 700 }}
                    >
                      {picked.size === missions.length ? "전체 해제" : "전체 선택"}
                    </button>
                  </div>

                  {missions.map((m) => {
                    const on = picked.has(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggle(m.id)}
                        role="checkbox"
                        aria-checked={on}
                        className="flex items-start gap-[10px] px-[12px] py-[10px] text-left"
                        style={{
                          border: "2px solid var(--ink)",
                          backgroundColor: on ? "var(--mode-bg-soft)" : "var(--canvas)",
                        }}
                      >
                        <span
                          className="flex-shrink-0 flex items-center justify-center mt-[2px]"
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid var(--ink)",
                            backgroundColor: on ? "var(--mode-accent)" : "var(--canvas)",
                          }}
                        >
                          {on && (
                            <Check size={12} strokeWidth={3} style={{ color: "var(--on-primary)" }} />
                          )}
                        </span>
                        <span className="flex-1 flex flex-col gap-[2px]">
                          <span className="text-body-md" style={{ color: "var(--ink)", fontWeight: 700 }}>
                            {m.emoji} {m.moment}
                            <span className="text-caption" style={{ color: "var(--muted)", fontWeight: 600 }}>
                              {" "}
                              · {m.day}일차
                            </span>
                          </span>
                          {m.prompt && (
                            <span className="text-caption" style={{ color: "var(--muted)" }}>
                              {m.prompt.length > 48 ? `${m.prompt.slice(0, 48)}…` : m.prompt}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* 꼬리말 */}
        {missions.length > 0 && (
          <div
            className="flex items-center gap-[8px] px-[16px] py-[12px] flex-shrink-0"
            style={{ borderTop: "3px solid var(--ink)" }}
          >
            <p className="flex-1 text-caption" style={{ color: "var(--muted)" }}>
              메모와 체크는 빼고 글만 가져옵니다
            </p>
            <button
              onClick={handleImport}
              disabled={picked.size === 0}
              className="px-[16px] h-[44px] text-button-md disabled:opacity-40"
              style={{
                border: "2px solid var(--ink)",
                backgroundColor: "var(--mode-accent)",
                color: "var(--on-primary)",
                fontWeight: 700,
              }}
            >
              {picked.size}장 가져오기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
