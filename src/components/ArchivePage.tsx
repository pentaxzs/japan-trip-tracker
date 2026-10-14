"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, MapPin, Calendar, Check, Trash2, MessageSquareQuote } from "lucide-react";
import { ArchivedTrip, MissionItem, TripMember } from "@/lib/types";
import {
  fetchArchive,
  deleteArchivedTripFromServer,
  updateArchivedMissions,
  DEFAULT_MEMBERS,
} from "@/lib/storage";
import { JAPAN_CITIES } from "@/components/TripInfoBar";

interface ArchivePageProps {
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function calcDuration(dep: string, ret: string): string {
  const d1 = new Date(dep);
  const d2 = new Date(ret);
  const nights = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return "";
  return `${nights}박${nights + 1}일`;
}

export default function ArchivePage({ onBack }: ArchivePageProps) {
  const [archives, setArchives] = useState<ArchivedTrip[]>([]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [openNotesId, setOpenNotesId] = useState<string | null>(null);
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // 메모를 고치면 화면에 바로 반영하고, 잠시 뒤 서버에 보낸다
  const editNote = useCallback(
    (tripId: string, missionId: string, memberId: string, value: string) => {
      setArchives((prev) => {
        const next = prev.map((t) =>
          t.id === tripId
            ? {
                ...t,
                missions: (t.missions ?? []).map((m) =>
                  m.id === missionId
                    ? { ...m, notes: { ...m.notes, [memberId]: value.slice(0, 1000) } }
                    : m
                ),
              }
            : t
        );

        const trip = next.find((t) => t.id === tripId);
        const timers = saveTimers.current;
        const pending = timers.get(tripId);
        if (pending) clearTimeout(pending);
        timers.set(
          tripId,
          setTimeout(() => {
            if (trip?.missions) updateArchivedMissions(tripId, trip.missions);
            timers.delete(tripId);
          }, 600)
        );

        return next;
      });
    },
    []
  );

  useEffect(() => {
    const timers = saveTimers.current;
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  useEffect(() => {
    fetchArchive().then(setArchives);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteArchivedTripFromServer(id);
    setArchives((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirmId(null);
  };

  const getCityLabel = (value: string) =>
    JAPAN_CITIES.find((c) => c.value === value)?.label ?? value;

  return (
    <div
      data-mode="after"
      className="mode-container min-h-dvh flex flex-col"
      style={{ backgroundColor: "var(--canvas)" }}
    >
      <div className="w-full max-w-[480px] mx-auto flex flex-col min-h-dvh">
        {/* Header */}
        <header
          className="h-14 flex items-center px-[16px] gap-[12px]"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <button
            onClick={onBack}
            className="flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              backgroundColor: "var(--surface-strong)",
              color: "var(--ink)",
            }}
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
          </button>
          <h1
            className="text-display-lg"
            style={{ color: "var(--ink)" }}
          >
            여행 아카이브
          </h1>
        </header>

        {/* Archive List */}
        <div className="flex-1 px-[16px] py-[16px] flex flex-col gap-[12px]">
          {archives.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-[12px] py-[64px]">
              <div
                className="w-[64px] h-[64px] flex items-center justify-center"
                style={{
                  borderRadius: "9999px",
                  backgroundColor: "var(--surface-strong)",
                }}
              >
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-body-md" style={{ color: "var(--muted)" }}>
                아직 아카이브된 여행이 없어요
              </p>
            </div>
          ) : (
            archives.map((trip) => {
              const totalBefore = trip.todos.before.length;
              const totalDuring = trip.todos.during.length;
              const totalAfter = trip.todos.after.length;
              const doneBefore = trip.todos.before.filter((t) => t.completed).length;
              const doneDuring = trip.todos.during.filter((t) => t.completed).length;
              const doneAfter = trip.todos.after.filter((t) => t.completed).length;
              const totalAll = totalBefore + totalDuring + totalAfter;
              const doneAll = doneBefore + doneDuring + doneAfter;

              // v1.0 아카이브에는 missions가 없다
              // 메모가 없는 카드도 보여준다 — 그때 쓴 이야기와 질문이 거기 있다
              const missions: MissionItem[] = trip.missions ?? [];
              // 아카이브마다 참여자가 다르다. 옛 기록에는 members가 없다
              const members: TripMember[] = trip.tripInfo.members ?? DEFAULT_MEMBERS;
              const notesOpen = openNotesId === trip.id;

              const hasDates = trip.tripInfo.departureDate && trip.tripInfo.returnDate;
              const duration = hasDates
                ? calcDuration(trip.tripInfo.departureDate!, trip.tripInfo.returnDate!)
                : null;

              return (
                <div
                  key={trip.id}
                  className="p-[16px] flex flex-col gap-[12px]"
                  style={{
                    borderRadius: "14px",
                    border: "1px solid var(--hairline)",
                    backgroundColor: "var(--canvas)",
                  }}
                >
                  {/* Title Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[6px]">
                      <MapPin size={14} style={{ color: "var(--mode-accent)" }} />
                      <span className="text-title-md" style={{ color: "var(--ink)" }}>
                        {getCityLabel(trip.tripInfo.destination)} 여행
                      </span>
                    </div>
                    {duration && (
                      <span
                        className="text-caption px-[8px] py-[2px]"
                        style={{
                          color: "var(--mode-accent)",
                          backgroundColor: "var(--surface-strong)",
                          borderRadius: "9999px",
                          fontWeight: 600,
                        }}
                      >
                        {duration}
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  {hasDates && (
                    <div className="flex items-center gap-[6px]">
                      <Calendar size={12} style={{ color: "var(--muted)" }} />
                      <span className="text-body-sm" style={{ color: "var(--muted)" }}>
                        {formatDate(trip.tripInfo.departureDate!)} → {formatDate(trip.tripInfo.returnDate!)}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-[8px]">
                    {[
                      { label: "여행 전", done: doneBefore, total: totalBefore },
                      { label: "여행 중", done: doneDuring, total: totalDuring },
                      { label: "여행 후", done: doneAfter, total: totalAfter },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex-1 py-[8px] text-center"
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "var(--surface-soft)",
                        }}
                      >
                        <div className="text-caption" style={{ color: "var(--muted)" }}>
                          {stat.label}
                        </div>
                        <div className="text-title-md" style={{ color: "var(--ink)" }}>
                          {stat.done}/{stat.total}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 그때의 미션 — 글은 그대로 두고 메모만 고칠 수 있다 */}
                  {missions.length > 0 && (
                    <div className="flex flex-col gap-[8px]">
                      <button
                        onClick={() => setOpenNotesId(notesOpen ? null : trip.id)}
                        aria-expanded={notesOpen}
                        className="flex items-center gap-[6px] text-body-sm"
                        style={{ color: "var(--mode-accent)", fontWeight: 600 }}
                      >
                        <MessageSquareQuote size={14} />
                        미션 {missions.length}장
                        <span style={{ color: "var(--muted)" }}>
                          {notesOpen ? "닫기" : "펼치기"}
                        </span>
                      </button>

                      {notesOpen && (
                        <ul className="flex flex-col gap-[10px]">
                          {missions.map((m) => (
                            <li
                              key={m.id}
                              className="px-[12px] py-[10px] flex flex-col gap-[6px]"
                              style={{
                                borderRadius: "8px",
                                backgroundColor: "var(--surface-soft)",
                              }}
                            >
                              <span
                                className="flex items-center gap-[6px] text-caption"
                                style={{ color: "var(--muted)", fontWeight: 700 }}
                              >
                                {m.completed && (
                                  <Check size={12} strokeWidth={3} style={{ color: "var(--mode-accent)" }} />
                                )}
                                {m.day}일차 · {m.emoji} {m.moment}
                              </span>

                              {m.story && (
                                <p
                                  className="text-body-sm"
                                  style={{ color: "var(--ink)", whiteSpace: "pre-wrap", opacity: 0.9 }}
                                >
                                  {m.story}
                                </p>
                              )}
                              {m.prompt && (
                                <p
                                  className="text-body-sm px-[8px] py-[6px]"
                                  style={{
                                    color: "var(--ink)",
                                    fontWeight: 600,
                                    whiteSpace: "pre-wrap",
                                    borderLeft: "3px solid var(--mode-accent)",
                                    backgroundColor: "var(--canvas)",
                                  }}
                                >
                                  {m.prompt}
                                </p>
                              )}

                              {members.map((member) => (
                                <label key={member.id} className="flex flex-col gap-[2px]">
                                  <span
                                    className="text-caption"
                                    style={{ color: "var(--muted)", fontWeight: 700 }}
                                  >
                                    {member.name} ✎
                                  </span>
                                  <textarea
                                    value={m.notes?.[member.id] ?? ""}
                                    onChange={(e) => editNote(trip.id, m.id, member.id, e.target.value)}
                                    placeholder="지금이라도 떠오른 게 있으면 적어두세요"
                                    rows={2}
                                    maxLength={1000}
                                    className="w-full outline-none resize-y"
                                    style={{
                                      padding: "8px",
                                      backgroundColor: "var(--canvas)",
                                      border: "1px solid var(--hairline)",
                                      borderRadius: "6px",
                                      fontSize: "16px",
                                      lineHeight: 1.5,
                                      color: "var(--ink)",
                                    }}
                                  />
                                </label>
                              ))}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Completion + Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[4px]">
                      <Check size={14} style={{ color: "var(--mode-accent)" }} />
                      <span className="text-body-sm" style={{ color: "var(--muted)" }}>
                        달성률 {totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-caption" style={{ color: "var(--muted-soft)" }}>
                        {formatDate(trip.archivedAt)}
                      </span>
                      {deleteConfirmId === trip.id ? (
                        <div className="flex items-center gap-[4px]">
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="text-caption px-[8px] py-[2px]"
                            style={{
                              borderRadius: "4px",
                              backgroundColor: "#c13515",
                              color: "#ffffff",
                            }}
                          >
                            삭제
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-caption px-[8px] py-[2px]"
                            style={{
                              borderRadius: "4px",
                              border: "1px solid var(--hairline)",
                              color: "var(--muted)",
                            }}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="flex items-center justify-center"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "9999px",
                            backgroundColor: "var(--surface-strong)",
                            color: "var(--muted)",
                          }}
                          aria-label="아카이브 삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
