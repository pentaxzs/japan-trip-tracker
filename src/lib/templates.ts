import { TodoItem, TodosByPhase, MissionItem } from "./types";

function createTodo(text: string): TodoItem {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    category: "default",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

export function createDefaultTodos(): TodosByPhase {
  return {
    before: [
      // 필수 서류
      "여권 유효기간 확인 (6개월 이상)",
      "여권 사본 촬영 및 저장",
      "비자 확인 (단기 방문은 무비자)",
      // 예약
      "항공권 예약 확인",
      "숙소 예약 확인",
      "포켓 와이파이 / 유심 예약",
      // 환전 / 결제
      "엔화 환전",
      "해외 결제 가능 카드 확인",
      "트래블월렛 / 트래블로그 충전",
      // 짐 싸기
      "여행 가방 꺼내기",
      "의류 준비",
      "세면도구 준비",
      "상비약 챙기기 (소화제, 두통약)",
      "카메라 / 보조배터리 충전",
      "어댑터 확인 (일본은 110V, A타입)",
      // 앱 설치
      "구글 맵 일본 오프라인 지도 다운",
      "구글 번역기 일본어 오프라인 다운",
      "스이카 앱 설치 or IC카드 준비",
    ].map(createTodo),

    during: [
      // 관광지
      "방문할 신사/절 체크",
      "전망대 방문",
      "현지 시장 구경",
      // 맛집
      "라멘 맛집 방문",
      "스시 오마카세 예약",
      "편의점 한정 음식 먹어보기",
      "이자카야 방문",
      // 쇼핑
      "돈키호테 방문",
      "드러그스토어 (마츠모토 키요시 등) 쇼핑",
      "기념품 구매",
      // 교통
      "스이카 충전 확인",
      "IC카드 잔액 확인",
      // 숙소
      "체크인 시간 확인",
      "귀중품 보관 확인",
    ].map(createTodo),

    after: [
      // 귀국 당일
      "짐 전부 챙겼는지 확인",
      "숙소 체크아웃",
      "공항 리무진 / 교통편 확인",
      "면세 한도 확인 (800,000원)",
      "기내 수하물 규정 확인",
      // 귀국 후
      "짐 정리",
      "환전 잔돈 처리 (다음 여행을 위해 보관 or 재환전)",
      "스이카 잔액 확인 (다음 여행 대비)",
      "구매 물품 정리",
      // 기록
      "여행 사진 백업 및 정리",
      "인스타그램 / 블로그 후기 작성",
      "여행 경비 정산",
      "다음 여행 아이디어 메모",
    ].map(createTodo),
  };
}

// --- 미션: 아빠가 아들에게 남길 순간들 ---

type MissionSeed = Pick<MissionItem, "emoji" | "moment" | "lens" | "story" | "prompt">;

/**
 * 2박 3일 도쿄 일정의 흐름을 따라가는 11개의 순간.
 * 많이 보여주기보다 장소마다 딱 하나의 이야기만 남기는 것이 목표.
 */
const MISSION_SEEDS: MissionSeed[] = [
  {
    emoji: "🛫",
    moment: "출국 · 비행기",
    lens: "세상은 생각보다 넓다",
    story:
      "아빠도 처음 일본 갈 때는 일본어도 지금처럼 못했고 모든 게 낯설었어. 공항에서 어디로 가야 할지 몰라서 한참 서 있었던 적도 있어.",
    prompt: "이번 여행에서 네가 제일 해보고 싶은 거 딱 하나만 골라봐.",
  },
  {
    emoji: "🚃",
    moment: "나리타 → 도쿄",
    lens: "낯선 곳에서 스스로 움직이기",
    story:
      "아빠는 출장 올 때마다 이 길로 들어왔어. 표지판이랑 노선도 보는 법만 알면 사실 혼자서도 다 갈 수 있어.",
    prompt: "[미션] 다음 역이랑 환승 방향, 네가 찾아서 아빠한테 알려줘. 틀려도 괜찮아.",
  },
  {
    emoji: "🏙",
    moment: "1일차 · 시부야",
    lens: "같은 도시도 다르게 설계된다",
    story:
      "사람이 이렇게 많은데 생각보다 서로 부딪히지 않지. 그냥 그런 게 아니라 길이랑 신호를 그렇게 만들어 둔 거야.",
    prompt: "서울이랑 제일 다른 게 뭐 같아? 한국엔 많은데 여기엔 없는 건?",
  },
  {
    emoji: "🍜",
    moment: "시부야 식사 · 쇼핑",
    lens: "언어는 시험이 아니라 도구다",
    story:
      "아빠도 처음부터 일본어를 한 게 아니야. 일하다 보니 필요해서 조금씩 배운 거야. 말이 통하면 갈 수 있는 데가 늘어나.",
    prompt: "[미션] 이번엔 네가 주문해볼래? これください(코레 쿠다사이) / ありがとうございます(아리가토 고자이마스)",
  },
  {
    emoji: "🌙",
    moment: "1일차 저녁",
    lens: "아빠에게도 서툴렀던 시절이 있었다",
    story:
      "아빠가 출장 왔을 때 당황했던 일 하나 들려주기. 성공담보다 실수했던 이야기, 무서웠던 이야기가 더 좋다.",
    prompt: "오늘 가장 신기했던 거 뭐였어?",
  },
  {
    emoji: "📘",
    moment: "2일차 · 후지코·F·후지오 뮤지엄",
    lens: "좋아하는 것을 오래 하면 세상에 뭔가 남는다",
    story:
      "도라에몽 뒤에는 한 사람이 수십 년 동안 그리고 생각하고 이야기를 만든 시간이 있어. 엄청 유명해지는 것보다 좋아하는 걸 오래 하는 게 멋있는 것 같아.",
    prompt: "너라면 어떤 걸 만들어서 사람들이 오래 기억하게 하고 싶어?",
  },
  {
    emoji: "🚶",
    moment: "도쿄 이동 중",
    lens: "관광지가 아니라 사람들이 사는 곳",
    story:
      "아빠가 출장 왔을 때 아침마다 이런 사람들 사이에 섞여서 회사에 갔어. 여기도 누가 공부하고 일하고 밥 먹고 사는 동네야.",
    prompt: "여기서 한 달 살면 어떤 게 제일 재미있을 것 같아?",
  },
  {
    emoji: "🏪",
    moment: "편의점 · 자판기 · 전철",
    lens: "세상은 누군가가 설계한 것이다",
    story:
      "이 버튼은 왜 여기 있을까? 처음 온 외국인도 알아볼 수 있게 뭘 해놨을까? 모든 물건과 공간에는 누군가의 의도가 있어.",
    prompt: "[미션] 잘 만들었다 싶은 것 하나, 불편한 것 하나 찾아보기.",
  },
  {
    emoji: "💴",
    moment: "2일차 저녁",
    lens: "돈은 크기가 아니라 선택이다",
    story:
      "돈이 무한히 있으면 다 살 수 있지만, 실제로는 뭘 더 원하는지 골라야 해. 오늘 쓸 돈은 네가 관리해봐.",
    prompt: "둘 중에 하나만 산다면 뭘 고를래? 왜?",
  },
  {
    emoji: "🗼",
    moment: "3일차 · 도쿄타워",
    lens: "네가 볼 세상은 아빠가 본 것보다 훨씬 넓다",
    story:
      "저 건물들 안에 진짜 다양한 일을 하는 사람들이 있어. 아빠도 아직 모르는 게 많고 계속 배우면서 살고 있어. 너도 지금 뭐가 될지 정하지 않아도 돼.",
    prompt: "10년 뒤에 너는 어떤 곳에서 뭘 하고 있을 것 같아? 한국 말고 다른 데서 살아보고 싶어?",
  },
  {
    emoji: "✈️",
    moment: "귀국길",
    lens: "여행을 자기 기억으로 만들기",
    story:
      "아빠의 베스트 1위도 말해주기. 관광지가 아니라 '네가 처음 일본어로 주문했던 것' 같은 순간이면 더 좋다.",
    prompt: "베스트 3 — ① 제일 재미있었던 것 ② 처음 해본 것 ③ 다시 하고 싶은 것",
  },
];

/**
 * 템플릿 카드의 id는 고정이다.
 * 여러 기기가 각자 missions 없는 데이터를 열어 기본값을 채워 넣어도
 * 같은 id가 나와야 3-way merge가 같은 카드로 인식한다 (랜덤 id면 22장으로 불어난다).
 */
function createMission(seed: MissionSeed, index: number): MissionItem {
  return {
    id: `mission-${String(index + 1).padStart(2, "0")}`,
    ...seed,
    note: "",
    completed: false,
    completedAt: null,
    custom: false,
    createdAt: new Date(0).toISOString(),
  };
}

export function createDefaultMissions(): MissionItem[] {
  return MISSION_SEEDS.map(createMission);
}

/** 아빠가 직접 추가하는 빈 카드 — 제목과 메모만 쓴다. */
export function createCustomMission(moment: string): MissionItem {
  return {
    id: crypto.randomUUID(),
    emoji: "📌",
    moment,
    lens: "",
    story: "",
    prompt: "",
    note: "",
    completed: false,
    completedAt: null,
    custom: true,
    createdAt: new Date().toISOString(),
  };
}
