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

/**
 * 미션 카드 — 여행의 한 "순간"마다 아빠가 남길 관점/이야기/질문.
 * 투두와 달리 체크 외에 아이 대답을 적는 note를 가진다.
 */
export interface MissionItem {
  id: string;
  emoji: string;
  /** 순간 이름 — "시부야", "귀국길" */
  moment: string;
  /** 관점 한 줄 — "다르다는 건 틀린 게 아니다" */
  lens: string;
  /** 아빠가 자연스럽게 꺼낼 이야기 */
  story: string;
  /** 아이에게 던질 질문 / 아이가 직접 해볼 미션 */
  prompt: string;
  /** 아이 대답 메모 — 현장에서 적는 기록 */
  note: string;
  completed: boolean;
  completedAt: string | null;
  /** 아빠가 직접 추가한 카드 (기본 템플릿이 아님) */
  custom: boolean;
  createdAt: string;
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
  /** v1.0 아카이브에는 없다 */
  missions?: MissionItem[];
  archivedAt: string;
}

export interface JapanTripData {
  version: string;
  createdAt: string;
  updatedAt: string;
  tripInfo: TripInfo;
  todos: TodosByPhase;
  missions: MissionItem[];
}
