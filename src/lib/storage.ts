import { JapanTripData, ArchivedTrip, MissionItem, TripMember } from "./types";
import {
  createDefaultTodos,
  createDefaultMissions,
  LEGACY_MOMENTS,
} from "./templates";

/**
 * 기본 참여자. id는 고정이다 — 여러 기기가 각자 초기화해도 같은 id가 나와야
 * 메모가 엉키지 않는다. 새로 추가하는 참여자만 랜덤 id를 받는다.
 */
export const DEFAULT_MEMBERS: TripMember[] = [
  { id: "m1", name: "아들(윤후)" },
  { id: "m2", name: "아빠" },
];

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
      members: DEFAULT_MEMBERS,
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
/**
 * 참여자를 현재 스키마(배열)로 맞춘다.
 * - 없던 데이터 → 기본 2명
 * - {child, parent} 한 쌍이던 구버전 → m1/m2 두 명으로. 이름은 지킨다
 */
function withMembers(data: JapanTripData): JapanTripData {
  const m = data.tripInfo?.members as unknown;
  if (Array.isArray(m) && m.every((x) => x && typeof x.id === "string")) return data;

  const legacy = m as { child?: string; parent?: string } | undefined;
  const members: TripMember[] =
    legacy && typeof legacy.child === "string" && typeof legacy.parent === "string"
      ? [
          { id: "m1", name: legacy.child },
          { id: "m2", name: legacy.parent },
        ]
      : DEFAULT_MEMBERS;

  return { ...data, tripInfo: { ...data.tripInfo, members } };
}

/** noteSon/noteDad 두 칸이던 메모를 참여자 id로 옮긴다 */
function withNotes(missions: MissionItem[]): MissionItem[] {
  if (missions.every((m) => m.notes && typeof m.notes === "object")) return missions;
  return missions.map((m) => {
    if (m.notes && typeof m.notes === "object") return m;
    const legacy = m as unknown as { noteSon?: string; noteDad?: string };
    const notes: Record<string, string> = {};
    if (legacy.noteSon) notes.m1 = legacy.noteSon;
    if (legacy.noteDad) notes.m2 = legacy.noteDad;
    const next = { ...m, notes };
    delete (next as Record<string, unknown>).noteSon;
    delete (next as Record<string, unknown>).noteDad;
    return next;
  });
}

function withMissions(data: JapanTripData): JapanTripData {
  const stored = data.missions;
  if (!Array.isArray(stored)) {
    return { ...data, missions: createDefaultMissions() };
  }

  const isCurrentSchema = stored.every(
    (m) => typeof m?.moment === "string" && typeof m?.prompt === "string"
  );
  if (isCurrentSchema) return { ...data, missions: withNotes(withDays(stored)) };

  const carriedOver = withNotes(
    stored.filter((m) => m?.custom).map((m) => ({
      ...m,
      day: typeof m.day === "number" ? m.day : 1,
    }))
  );

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
    if (data) return withMembers(withMissions(data as JapanTripData));
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

/** 아카이브된 여행의 미션 메모를 고쳐 저장한다 */
export async function updateArchivedMissions(
  id: string,
  missions: MissionItem[]
): Promise<void> {
  try {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-archive-missions", id, missions }),
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
