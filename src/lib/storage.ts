import { JapanTripData, ArchivedTrip } from "./types";
import { createDefaultTodos } from "./templates";

const STORAGE_KEY = "japan-trip-tracker";
const ARCHIVE_KEY = "japan-trip-archive";

function createInitialData(): JapanTripData {
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

export function loadTripData(): JapanTripData {
  if (typeof window === "undefined") {
    return createInitialData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialData();
      saveTripData(initial);
      return initial;
    }
    return JSON.parse(raw) as JapanTripData;
  } catch {
    const initial = createInitialData();
    saveTripData(initial);
    return initial;
  }
}

export function saveTripData(data: JapanTripData): void {
  if (typeof window === "undefined") return;

  const updated: JapanTripData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // LocalStorage full or unavailable
  }
}

export function loadArchive(): ArchivedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    return raw ? (JSON.parse(raw) as ArchivedTrip[]) : [];
  } catch {
    return [];
  }
}

export function archiveTrip(data: JapanTripData): void {
  if (typeof window === "undefined") return;

  const archived: ArchivedTrip = {
    id: crypto.randomUUID(),
    tripInfo: data.tripInfo,
    todos: data.todos,
    archivedAt: new Date().toISOString(),
  };

  const existing = loadArchive();
  existing.unshift(archived);

  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(existing));
  } catch {
    // LocalStorage full
  }
}

export function deleteArchivedTrip(id: string): void {
  if (typeof window === "undefined") return;
  const existing = loadArchive();
  const filtered = existing.filter((t) => t.id !== id);
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(filtered));
  } catch {
    // LocalStorage full
  }
}

export function resetTripData(): JapanTripData {
  const initial = createInitialData();
  saveTripData(initial);
  return initial;
}
