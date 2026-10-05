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
      "아빠가 처음 일본에 갔을 때는 일본어도 지금처럼 못했고 모든 게 낯설었다. 공항에서 어디로 가야 할지 몰라 한참 서 있던 적도 있다.",
    prompt: "이번 여행에서 제일 해보고 싶은 거, 하나씩 골라보기",
  },
  {
    emoji: "🚃",
    moment: "나리타 → 도쿄",
    lens: "낯선 곳에서 길 찾기",
    story:
      "아빠도 출장 올 때마다 이 길로 들어왔다. 표지판과 노선도 보는 법만 알면 사실 혼자서도 갈 수 있다.",
    prompt: "다음 역이랑 환승 방향, 누가 먼저 찾을까? 틀려도 괜찮다",
  },
  {
    emoji: "🏙",
    moment: "1일차 · 시부야",
    lens: "같은 도시도 다르게 설계된다",
    story:
      "사람이 이렇게 많은데 생각보다 서로 부딪히지 않는다. 그냥 그렇게 된 게 아니라 길이랑 신호를 그렇게 만들어 둔 것이다.",
    prompt: "서울이랑 제일 다른 게 뭘까? 한국엔 많은데 여기엔 없는 건?",
  },
  {
    emoji: "🍜",
    moment: "시부야 식사 · 쇼핑",
    lens: "언어는 시험이 아니라 도구다",
    story:
      "아빠도 처음부터 일본어를 한 건 아니다. 일하다 보니 필요해서 조금씩 배웠다. 말이 통하면 갈 수 있는 곳이 늘어난다.",
    prompt:
      "주문은 한 번씩 나눠서 해보기. これください(코레 쿠다사이) / ありがとうございます(아리가토 고자이마스)",
  },
  {
    emoji: "🌙",
    moment: "1일차 저녁",
    lens: "누구에게나 서툴렀던 때가 있다",
    story:
      "아빠가 일본에서 일할 때도 당황한 일, 실수한 일이 많았다. 지금은 웃으면서 이야기할 수 있는 것들이다.",
    prompt: "오늘 제일 신기했던 것, 그리고 제일 당황했던 것 하나씩",
  },
  {
    emoji: "📘",
    moment: "2일차 · 후지코·F·후지오 뮤지엄",
    lens: "좋아하는 걸 오래 하면 뭔가 남는다",
    story:
      "도라에몽 뒤에는 한 사람이 수십 년 동안 그리고, 생각하고, 이야기를 만든 시간이 있다. 엄청 유명해지는 것보다 좋아하는 걸 오래 하는 게 더 어렵다.",
    prompt: "뭘 만들어서 사람들이 오래 기억하게 하고 싶어?",
  },
  {
    emoji: "🚶",
    moment: "도쿄 이동 중",
    lens: "관광지가 아니라 사람들이 사는 곳",
    story:
      "아빠가 출장 왔을 때 아침마다 이 사람들 사이에 섞여서 회사에 갔다. 여기도 누군가 공부하고, 일하고, 밥 먹고 사는 동네다.",
    prompt: "여기서 한 달 살면 뭐가 제일 재미있을까?",
  },
  {
    emoji: "🏪",
    moment: "편의점 · 자판기 · 전철",
    lens: "세상은 누군가가 설계한 것이다",
    story:
      "버튼은 왜 하필 거기 있을까. 처음 온 외국인도 알아볼 수 있게 뭘 해뒀을까. 모든 물건과 공간에는 누군가의 의도가 있다.",
    prompt: "잘 만들었다 싶은 것 하나, 불편한 것 하나씩 찾아보기",
  },
  {
    emoji: "💴",
    moment: "2일차 저녁",
    lens: "돈은 크기가 아니라 선택이다",
    story:
      "돈이 무한히 있으면 다 살 수 있지만, 실제로는 뭘 더 원하는지 골라야 한다. 어른도 매일 하는 고민이다.",
    prompt: "둘 중에 하나만 산다면 뭘 고를까? 이유는?",
  },
  {
    emoji: "🗼",
    moment: "3일차 · 도쿄타워",
    lens: "앞으로 볼 세상은 지금보다 넓다",
    story:
      "저 건물들 안에 정말 다양한 일을 하는 사람들이 있다. 아빠도 아직 모르는 게 많고 계속 배우면서 산다. 지금 뭐가 될지 정하지 않아도 된다.",
    prompt: "10년 뒤엔 어디서 뭘 하고 있을까? 한국 말고 다른 데서 살아보고 싶어?",
  },
  {
    emoji: "✈️",
    moment: "귀국길",
    lens: "여행을 각자의 기억으로",
    story:
      "같은 3일을 보내도 기억에 남는 장면은 서로 다르다. 유명한 곳보다 '그때 그거 했잖아' 쪽이 오래 간다.",
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
    noteSon: "",
    noteDad: "",
    completed: false,
    completedAt: null,
    custom: false,
    createdAt: new Date(0).toISOString(),
  };
}

export function createDefaultMissions(): MissionItem[] {
  return MISSION_SEEDS.map(createMission);
}

/** 직접 추가하는 빈 카드 — 제목과 메모만 쓴다. */
export function createCustomMission(moment: string): MissionItem {
  return {
    id: crypto.randomUUID(),
    emoji: "📌",
    moment,
    lens: "",
    story: "",
    prompt: "",
    noteSon: "",
    noteDad: "",
    completed: false,
    completedAt: null,
    custom: true,
    createdAt: new Date().toISOString(),
  };
}
