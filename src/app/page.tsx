"use client";

import { useState } from "react";
import { Archive } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import HeroSection from "@/components/HeroSection";
import ProgressBar from "@/components/ProgressBar";
import TodoList from "@/components/TodoList";
import TodoInput from "@/components/TodoInput";
import TripInfoBar from "@/components/TripInfoBar";
import ArchivePage from "@/components/ArchivePage";

export default function Home() {
  const {
    phase,
    setPhase,
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    completedCount,
    totalCount,
    progress,
    isLoaded,
    tripInfo,
    updateTripInfo,
    endTrip,
  } = useTodos();

  const [showArchive, setShowArchive] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  if (!isLoaded) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: "var(--canvas)" }}
      >
        <div className="text-5xl">✈️</div>
      </div>
    );
  }

  if (showArchive) {
    return <ArchivePage onBack={() => setShowArchive(false)} />;
  }

  return (
    <div
      data-mode={phase}
      className="mode-container min-h-dvh flex flex-col"
      style={{ backgroundColor: "var(--mode-bg)" }}
    >
      <div className="w-full max-w-[520px] md:max-w-[640px] mx-auto flex flex-col min-h-dvh px-0 md:my-[24px] md:min-h-0 md:border-x-[3px] md:border-b-[3px] md:border-[var(--ink)]" style={{ backgroundColor: "var(--canvas)" }}>
        {/* Header — with archive button */}
        <div className="relative">
          <Header />
          <button
            onClick={() => setShowArchive(true)}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9999px",
              backgroundColor: "var(--surface-strong)",
              color: "var(--muted)",
            }}
            aria-label="여행 아카이브"
          >
            <Archive size={16} />
          </button>
        </div>

        {/* Trip Info — destination, dates, weather */}
        <TripInfoBar
          destination={tripInfo.destination}
          departureDate={tripInfo.departureDate}
          returnDate={tripInfo.returnDate}
          onDestinationChange={(dest) => updateTripInfo({ destination: dest })}
          onDepartureDateChange={(date) => updateTripInfo({ departureDate: date })}
          onReturnDateChange={(date) => updateTripInfo({ returnDate: date })}
        />

        {/* Tab Navigation — 48px fixed, Airbnb nav-link style */}
        <TabNav currentPhase={phase} onPhaseChange={setPhase} />

        {/* Hero Section — gradient background */}
        <div
          className="w-full"
          style={{ backgroundImage: "var(--mode-hero-gradient)" }}
        >
          <HeroSection
            phase={phase}
            departureDate={tripInfo.departureDate}
            returnDate={tripInfo.returnDate}
          />
        </div>

        {/* Progress Bar */}
        <div className="py-[8px]">
          <ProgressBar
            completedCount={completedCount}
            totalCount={totalCount}
            progress={progress}
          />
        </div>

        {/* Todo List — scrollable area */}
        <TodoList
          todos={todos}
          phase={phase}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

        {/* End Trip Button — only on "after" tab */}
        {phase === "after" && (
          <div className="px-[16px] py-[12px]">
            {showEndConfirm ? (
              <div
                className="p-[16px] text-center flex flex-col gap-[12px]"
                style={{
                  backgroundColor: "var(--surface-soft)",
                  borderRadius: "14px",
                  border: "1px solid var(--hairline)",
                }}
              >
                <p className="text-body-md" style={{ color: "var(--ink)" }}>
                  이 여행을 아카이브하고 새 여행을 시작할까요?
                </p>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => setShowEndConfirm(false)}
                    className="flex-1 h-[48px] text-button-md"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid var(--hairline)",
                      backgroundColor: "var(--canvas)",
                      color: "var(--ink)",
                    }}
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      endTrip();
                      setShowEndConfirm(false);
                    }}
                    className="flex-1 h-[48px] text-button-md"
                    style={{
                      borderRadius: "8px",
                      backgroundColor: "var(--mode-accent)",
                      color: "var(--on-primary)",
                    }}
                  >
                    여행 종료
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowEndConfirm(true)}
                className="w-full h-[48px] text-button-md"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "var(--mode-accent)",
                  color: "var(--on-primary)",
                }}
              >
                🎌 여행 종료 & 아카이브
              </button>
            )}
          </div>
        )}

        {/* Input Area — pinned to bottom */}
        <div
          className="sticky bottom-0 border-t"
          style={{
            backgroundColor: "var(--mode-bg)",
            borderColor: "var(--hairline)",
          }}
        >
          <TodoInput onAdd={addTodo} />
        </div>
      </div>
    </div>
  );
}
