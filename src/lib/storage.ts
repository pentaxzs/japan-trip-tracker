import { JapanTripData, ArchivedTrip, MissionItem } from "./types";
import {
  createDefaultTodos,
  createDefaultMissions,
  LEGACY_MOMENTS,
} from "./templates";

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
  if (isCurrentSchema) return { ...data, missions: withDays(stored) };

  const carriedOver = stored
    .filter((m) => m?.custom)
    .map((m) => ({
      ...m,
      noteSon: typeof m.noteSon === "string" ? m.noteSon : "",
      noteDad: typeof m.noteDad === "string" ? m.noteDad : "",
      day: typeof m.day === "number" ? m.day : 1,
    }));

  return { ...data, missions: [...carriedOver, ...createDefaultMissions()] };
}

/**
 * day가 없던 시절 데이터에 날차를 채운다.
 * 메모와 체크, 직접 고친 문구는 전부 그대로 둔다. 제목은 손대지 않은
 * 카드만 "1일차 · 시부야" → "시부야"처럼 접두사를 뗀다.
 */
function withDays(missions: MissionItem[]): MissionItem[] {
  if (missions.every((m) => typeof m.day === "number")) return missions;

  const defaults = new Map(createDefaultMissions().map((m) => [m.id, m]));
  return missions.map((m) => {
    if (typeof m.day === "number") return m;
    const template = defaults.get(m.id);
    // 직접 추가한 카드는 대응되는 템플릿이 없다 → 1일차로 둔다
    if (!template) return { ...m, day: 1 };
    const untouchedTitle = LEGACY_MOMENTS[m.id] === m.moment;
    return {
      ...m,
      day: template.day,
      moment: untouchedTitle ? template.moment : m.moment,
    };
  });
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
