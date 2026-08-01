import { JapanTripData, ArchivedTrip } from "./types";
import { createDefaultTodos } from "./templates";

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
  };
}

// --- API-based storage (Redis via API Route) ---

export async function fetchTripData(): Promise<JapanTripData> {
  try {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data) return data as JapanTripData;
  } catch {
    // API unavailable
  }
  return createInitialData();
}

export async function saveTripDataToServer(data: JapanTripData): Promise<void> {
  const updated = { ...data, updatedAt: new Date().toISOString() };
  try {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", data: updated }),
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
