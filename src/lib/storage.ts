import { JapanTripData, ArchivedTrip } from "./types";
import { createDefaultTodos, createDefaultMissions } from "./templates";

export function createInitialData(): JapanTripData {
  const now = new Date().toISOString();
  return {
    version: "1.0",
    createdAt: now,
    updatedAt: now,
    tripInfo: {
      title: "일본 여행",
      destination: "tokyo",
      departureDate: null,
      returnDate: null,
    },
    todos: createDefaultTodos(),
    missions: createDefaultMissions(),
  };
}

/**
 * 저장된 missions를 현재 스키마로 맞춘다. 기존 투두는 손대지 않는다.
 * - missions 자체가 없는 v1.0 데이터 → 기본 미션 주입
 * - note 한 칸만 있던 구버전 → 아들/아빠 칸으로 나뉜 새 문구로 교체.
 *   직접 추가한 카드는 템플릿에 대응되는 게 없으므로 그대로 들고 간다.
 */
function withMissions(data: JapanTripData): JapanTripData {
  const stored = data.missions;
  if (!Array.isArray(stored)) {
    return { ...data, missions: createDefaultMissions() };
  }

  const isCurrentSchema = stored.every(
    (m) => typeof m?.noteSon === "string" && typeof m?.noteDad === "string"
  );
  if (isCurrentSchema) return data;

  const carriedOver = stored
    .filter((m) => m?.custom)
    .map((m) => ({
      ...m,
      noteSon: typeof m.noteSon === "string" ? m.noteSon : "",
      noteDad: typeof m.noteDad === "string" ? m.noteDad : "",
    }));

  return { ...data, missions: [...carriedOver, ...createDefaultMissions()] };
}

// --- API-based storage (Redis via API Route) ---

export async function fetchTripData(): Promise<JapanTripData> {
  try {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data) return withMissions(data as JapanTripData);
  } catch {
    // API unavailable
  }
  return createInitialData();
}

export async function saveTripDataToServer(data: JapanTripData): Promise<void> {
  try {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", data }),
    });
  } catch {
    // Silently fail
  }
}

export async function fetchArchive(): Promise<ArchivedTrip[]> {
  try {
    const res = await fetch("/api/todos?type=archive");
    return (await res.json()) as ArchivedTrip[];
  } catch {
    return [];
  }
}

export async function archiveTripToServer(data: JapanTripData): Promise<void> {
  const archived: ArchivedTrip = {
    id: crypto.randomUUID(),
    tripInfo: data.tripInfo,
    todos: data.todos,
    missions: data.missions,
    archivedAt: new Date().toISOString(),
  };
  try {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive", trip: archived }),
    });
  } catch {
    // Silently fail
  }
}

export async function deleteArchivedTripFromServer(id: string): Promise<void> {
  try {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-archive", id }),
    });
  } catch {
    // Silently fail
  }
}
