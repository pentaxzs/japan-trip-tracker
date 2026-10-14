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
 * 미션 카드 — 여행의 한 "순간"에 둘이 같이 보는 화면.
 * 한쪽을 코칭하는 지시문이 아니라 둘 다 읽을 수 있는 문장으로 쓴다.
 * 메모는 아들/아빠가 각자 쓴다.
 */
export interface MissionItem {
  id: string;
  emoji: string;
  /** 여행 며칠째인지 — 1부터 시작 */
  day: number;
  /** 순간 이름 — "시부야", "귀국길" */
  moment: string;
  /** 관점 한 줄 — "낯선 곳에서 길 찾기" */
  lens: string;
  /** 이 순간에 깔아두는 이야기 (사실/배경, 지시문이 아니다) */
  story: string;
  /** 둘이 같이 이야기해볼 질문 */
  prompt: string;
  /** 참여자 id → 그 사람이 쓴 메모. tripInfo.members가 누가 있는지 정한다 */
  notes: Record<string, string>;
  completed: boolean;
  completedAt: string | null;
  /** 직접 추가한 카드 (기본 템플릿이 아님) */
  custom: boolean;
  createdAt: string;
}

/** 미션 메모를 쓰는 사람 */
export interface TripMember {
  /** 이름을 바꿔도 메모가 따라가도록 id는 고정이다 */
  id: string;
  name: string;
}

/** 한 여행에 설정할 수 있는 최대 인원 */
export const MAX_MEMBERS = 4;

export interface TripInfo {
  title: string;
  destination: string;
  departureDate: string | null;
  returnDate: string | null;
  /** 1~MAX_MEMBERS명 */
  members: TripMember[];
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
