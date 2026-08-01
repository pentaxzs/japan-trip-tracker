export type TripPhase = "before" | "during" | "after";

export type TodoCategory =
  | "default"
  | "sightseeing"
  | "food"
  | "shopping"
  | "transport"
  | "accommodation"
  | "other";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: string;
  completedAt: string | null;
}

export interface TodosByPhase {
  before: TodoItem[];
  during: TodoItem[];
  after: TodoItem[];
}

export interface TripInfo {
  title: string;
  destination: string;
  departureDate: string | null;
  returnDate: string | null;
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

export interface ArchivedTrip {
  id: string;
  tripInfo: TripInfo;
  todos: TodosByPhase;
  archivedAt: string;
}

export interface JapanTripData {
  version: string;
  createdAt: string;
  updatedAt: string;
  tripInfo: TripInfo;
  todos: TodosByPhase;
}
