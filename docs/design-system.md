# Japan Trip Tracker — Design System Guide

> 선정 기준일: 2026-07-30
> 기반 디자인 시스템: **Airbnb** (https://getdesign.md/airbnb/design-md)
> 설치 명령: `npx getdesign@latest add airbnb`

---

## 1. 선정 디자인 시스템

### Airbnb Design System

| 항목 | 내용 |
|------|------|
| 이름 | Airbnb |
| URL | https://getdesign.md/airbnb/design-md |
| 설치 | `npx getdesign@latest add airbnb` |
| 누적 설치 | 18K+ |
| 특징 | 여행 마켓플레이스 기반, 따뜻한 코랄 액센트, 사진 중심, 둥근 UI |

**선정 이유:**

Japan Trip Tracker는 여행 준비부터 마무리까지 감성적인 경험을 중시하는 앱입니다. Airbnb 디자인 시스템은 이 앱과 다음과 같은 이유로 최적의 조합입니다.

1. **여행 도메인 일치** — Airbnb는 전 세계에서 가장 사랑받는 여행 플랫폼의 디자인 시스템으로, 여행자들에게 친숙한 감성을 제공합니다.
2. **따뜻한 코랄 톤** — Rausch (#ff385c)를 기반으로 한 따뜻한 색감이 여행의 설렘과 즐거움을 자연스럽게 표현합니다.
3. **둥글고 친근한 UI** — 8–14px의 부드러운 모서리 처리와 풀 필 서치바가 발랄하고 즐거운 톤앤매너와 일치합니다.
4. **감성적 레이아웃** — 사진 중심의 카드 컴포넌트가 여행지, 맛집, 쇼핑 카테고리 TODO를 시각적으로 표현하기에 적합합니다.
5. **높은 접근성** — Primary CTA 최소 48×48px, WCAG AAA 수준의 터치 타겟 보장.

---

## 2. 모드별 컬러 팔레트

Japan Trip Tracker는 3가지 모드에 따라 서로 다른 감성을 전달합니다. 각 모드의 팔레트는 Airbnb의 기본 시스템(화이트 캔버스, 잉크 텍스트, 코랄 브랜드 컬러)을 토대로 모드 고유의 액센트와 배경색을 입혔습니다.

### 2-A. 여행 전 (Before) — 설레임 테마

두근두근 여행을 기다리는 설렘. 따뜻한 파스텔 핑크-오렌지 그라데이션으로 기대감을 표현합니다.

| 토큰 | HEX | 용도 |
|------|-----|------|
| `before-bg` | `#FFF5F0` | 페이지 배경 (파스텔 핑크-오렌지 베이스) |
| `before-bg-soft` | `#FFE8DC` | 카드·섹션 배경 (한 단계 진한 파스텔) |
| `before-accent` | `#FF385C` | Primary CTA, 체크박스, 활성 탭 (Airbnb Rausch) |
| `before-accent-active` | `#E00B41` | 버튼 Pressed 상태 |
| `before-accent-light` | `#FFD1DA` | Disabled 버튼, 완료 항목 배경 |
| `before-accent-glow` | `#FF6B6B` | 호버 효과, 포커스 링 |
| `before-ink` | `#222222` | 제목, 본문 (Airbnb ink 그대로) |
| `before-ink-muted` | `#6A6A6A` | 부제목, 플레이스홀더 |
| `before-hairline` | `#FFCFC7` | 구분선 (핑크 계열로 따뜻하게) |
| `before-complete-bg` | `#FFF0F0` | 완료된 TODO 항목 배경 |
| `before-complete-text` | `#FF9DAD` | 완료 항목 취소선 텍스트 |
| `before-hero-gradient-start` | `#FFF0E6` | 히어로 그라데이션 시작 |
| `before-hero-gradient-end` | `#FFE4D6` | 히어로 그라데이션 끝 |

**Hero 카피:** "두근두근! 일본 여행 준비 중" / "설레는 여행의 시작, 하나씩 체크해봐요"

---

### 2-B. 여행 중 (During) — 활기찬 테마

에너지 넘치는 현장감. 밝고 생동감 있는 옐로우-민트 계열로 신나는 여행 중 분위기를 표현합니다.

| 토큰 | HEX | 용도 |
|------|-----|------|
| `during-bg` | `#FFFDE7` | 페이지 배경 (밝은 옐로우-크림) |
| `during-bg-soft` | `#FFF9C4` | 카드·섹션 배경 |
| `during-accent` | `#F59E0B` | Primary CTA, 체크박스, 활성 탭 (앰버 옐로우) |
| `during-accent-active` | `#D97706` | 버튼 Pressed 상태 |
| `during-accent-light` | `#FDE68A` | Disabled 버튼, 태그 배경 |
| `during-accent-glow` | `#FBBF24` | 호버 효과, 체크 완료 팝 이펙트 |
| `during-ink` | `#222222` | 제목, 본문 |
| `during-ink-muted` | `#6A6A6A` | 부제목, 플레이스홀더 |
| `during-hairline` | `#FCD34D` | 구분선 (옐로우 계열) |
| `during-complete-bg` | `#F0FDF4` | 완료된 TODO 항목 배경 (민트) |
| `during-complete-text` | `#86EFAC` | 완료 항목 취소선 텍스트 |
| `during-hero-gradient-start` | `#FFFDE7` | 히어로 그라데이션 시작 |
| `during-hero-gradient-end` | `#E8F5E9` | 히어로 그라데이션 끝 (민트로 전환) |
| `during-category-sightseeing` | `#3B82F6` | 관광지 카테고리 뱃지 |
| `during-category-food` | `#EF4444` | 맛집 카테고리 뱃지 |
| `during-category-shopping` | `#8B5CF6` | 쇼핑 카테고리 뱃지 |
| `during-category-transport` | `#06B6D4` | 교통 카테고리 뱃지 |
| `during-category-accommodation` | `#10B981` | 숙소 카테고리 뱃지 |

**Hero 카피:** "신나는 일본 여행 중!" / "오늘도 즐거운 하루! 하나씩 정복해봐요"

---

### 2-C. 여행 후 (After) — 차분한 마무리 테마

소중한 추억을 돌아보는 회고적 시간. 라벤더-그레이 계열로 차분하고 따뜻한 마무리 분위기를 연출합니다.

| 토큰 | HEX | 용도 |
|------|-----|------|
| `after-bg` | `#F5F3FF` | 페이지 배경 (소프트 라벤더) |
| `after-bg-soft` | `#EDE9F6` | 카드·섹션 배경 |
| `after-accent` | `#7C3AED` | Primary CTA, 체크박스, 활성 탭 (바이올렛) |
| `after-accent-active` | `#6D28D9` | 버튼 Pressed 상태 |
| `after-accent-light` | `#DDD6FE` | Disabled 버튼, 완료 항목 배경 |
| `after-accent-glow` | `#8B5CF6` | 호버 효과, 포커스 링 |
| `after-ink` | `#222222` | 제목, 본문 |
| `after-ink-muted` | `#6A6A6A` | 부제목, 플레이스홀더 |
| `after-hairline` | `#C4B5FD` | 구분선 (라벤더 계열) |
| `after-complete-bg` | `#F3F0FF` | 완료된 TODO 항목 배경 |
| `after-complete-text` | `#A78BFA` | 완료 항목 취소선 텍스트 |
| `after-hero-gradient-start` | `#F3F0FF` | 히어로 그라데이션 시작 |
| `after-hero-gradient-end` | `#EDE9F6` | 히어로 그라데이션 끝 |

**Hero 카피:** "즐거웠던 일본 여행, 마무리해봐요" / "좋은 추억을 차곡차곡 정리해요"

---

### 2-D. 공통 팔레트 (전 모드 공유)

Airbnb 코어 시스템에서 가져온 공통 토큰입니다.

| 토큰 | HEX | 용도 |
|------|-----|------|
| `canvas` | `#FFFFFF` | 기본 페이지 표면 |
| `surface-soft` | `#F7F7F7` | 비활성 필드, 서브 배경 |
| `surface-strong` | `#F2F2F2` | 아이콘 버튼 배경 |
| `hairline` | `#DDDDDD` | 기본 1px 구분선 |
| `ink` | `#222222` | 기본 텍스트 |
| `body` | `#3F3F3F` | 본문 텍스트 |
| `muted` | `#6A6A6A` | 보조 텍스트 |
| `error` | `#C13515` | 폼 유효성 오류 |

---

## 3. 타이포그래피

Airbnb 디자인 시스템은 Cereal VF를 사용하지만, 무료 대체 폰트로 **Noto Sans KR** (한국어 지원) + **Inter** (영문 UI)를 권장합니다.

### 폰트 스택

```css
font-family: 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont,
             'Segoe UI', sans-serif;
```

### Google Fonts 임포트

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 타이포그래피 스케일

Airbnb 시스템의 스케일을 기반으로 모바일 우선 여행 앱에 최적화했습니다.

| 토큰 | 크기 | 굵기 | 줄간격 | 자간 | 용도 |
|------|------|------|--------|------|------|
| `display-xl` | 28px | 700 | 1.43 | -0.44px | 히어로 메인 타이틀 |
| `display-lg` | 22px | 700 | 1.18 | -0.44px | 섹션 제목 |
| `display-md` | 20px | 700 | 1.4 | -0.18px | 카드 메인 타이틀 |
| `title-md` | 18px | 600 | 1.25 | 0 | TODO 카테고리 제목 |
| `title-sm` | 16px | 600 | 1.25 | 0 | TODO 항목 텍스트 |
| `body-md` | 16px | 400 | 1.5 | 0 | 본문, 부제목 |
| `body-sm` | 14px | 400 | 1.43 | 0 | 보조 텍스트, 날짜 |
| `caption` | 13px | 500 | 1.23 | 0 | 카운터, 뱃지 |
| `button-md` | 16px | 500 | 1.25 | 0 | 버튼 레이블 |
| `nav-link` | 15px | 600 | 1.25 | 0 | 탭 네비게이션 |

---

## 4. 컴포넌트 스타일링 가이드

### 4-1. 탭 네비게이션 (TabNav)

Airbnb의 카테고리 스트립 패턴을 적용합니다.

```
[여행 전]  [여행 중]  [여행 후]
```

- **배경**: `canvas` (#FFFFFF)
- **탭 높이**: 48px (WCAG AAA 터치 타겟)
- **활성 탭**: 하단 2px 실선 (모드별 accent 색상), `title-sm` 굵기 600
- **비활성 탭**: `muted` (#6A6A6A), `title-sm` 굵기 400
- **호버**: `surface-soft` 배경
- **border-radius**: 0 (상단 네비게이션 — Airbnb 탭 패턴)

### 4-2. 히어로 섹션 (HeroSection)

```
[그라데이션 배경]
  이모지 아이콘 (40px)
  메인 타이틀 (display-xl)
  부제목 (body-md, muted)
  진행률 뱃지 (옵션)
```

- **배경**: 모드별 `hero-gradient-start` → `hero-gradient-end` 세로 그라데이션
- **패딩**: 24px 상하, 16px 좌우
- **border-radius**: 0 (풀 너비)
- **타이틀**: `display-xl`, 모드별 `ink` 컬러
- **부제목**: `body-md`, `muted` 컬러

### 4-3. TODO 항목 (TodoItem)

Airbnb 프로퍼티 카드의 메타 블록 스타일을 1D 리스트 형식으로 적용합니다.

```
[체크박스] [항목 텍스트]  [삭제 버튼]
```

**기본 상태:**
- **배경**: `canvas` (#FFFFFF)
- **높이**: 56px (최소 터치 타겟 보장)
- **패딩**: 16px 좌우, 12px 상하
- **border-radius**: 14px (Airbnb `rounded.md`)
- **border**: 1px solid `hairline` (#DDDDDD)
- **그림자**: 없음 (Airbnb flat 원칙)
- **텍스트**: `title-sm` (16px / 600), `ink` (#222222)

**완료 상태:**
- **배경**: 모드별 `complete-bg`
- **텍스트**: 취소선 + 모드별 `complete-text` 컬러
- **체크박스**: 모드별 accent 색상 채우기

**호버 상태:**
- **배경**: `surface-soft` (#F7F7F7)
- **border**: 1px solid `border-strong` (#C1C1C1)

### 4-4. 체크박스

Airbnb의 소프트한 인터랙션 원칙을 따릅니다.

- **크기**: 24×24px
- **border-radius**: 8px (Airbnb `rounded.sm`) — 원형이 아닌 둥근 사각형
- **기본 상태**: 1px solid `hairline`, `canvas` 배경
- **완료 상태**: 모드별 accent 색상 배경, 흰색 체크 아이콘
- **호버**: 모드별 accent 색상의 10% 투명도 배경
- **트랜지션**: `all 150ms ease`

### 4-5. 입력창 (TodoInput)

Airbnb의 플로팅 레이블 입력창 패턴 적용.

```
[+ 새 할 일을 입력하세요...]     [추가]
```

- **높이**: 56px
- **border-radius**: 14px (Airbnb `rounded.md`)
- **border**: 1px solid `hairline` (#DDDDDD)
- **포커스**: 2px solid 모드별 accent 색상
- **플레이스홀더**: `muted` (#6A6A6A), `body-md`
- **추가 버튼**: 모드별 accent Primary 버튼 스타일 (border-radius: 8px)

### 4-6. 버튼 변형

Airbnb 버튼 시스템 그대로 적용하되 모드별 색상을 사용합니다.

**Primary 버튼 (추가, CTA):**
- **배경**: 모드별 accent
- **텍스트**: 흰색, `button-md`
- **border-radius**: 8px (Airbnb `rounded.sm`)
- **높이**: 48px
- **호버**: 모드별 `accent-active`

**Secondary 버튼:**
- **배경**: `canvas`
- **테두리**: 1px solid `ink`
- **텍스트**: `ink`, `button-md`

**Tertiary / 텍스트 버튼:**
- **배경**: 없음
- **텍스트**: `muted`, 밑줄

**삭제 버튼 (아이콘):**
- **크기**: 32×32px 원형
- **배경**: `surface-strong` (#F2F2F2)
- **아이콘**: Lucide `Trash2`, `muted` 색상
- **호버**: `error` (#C13515) 색상으로 전환

### 4-7. 진행률 바 (ProgressBar) — Phase 2

Airbnb의 단순하고 명확한 비주얼 언어를 따릅니다.

```
[=====>        ] 3/10 완료
```

- **배경 트랙**: `surface-soft` (#F7F7F7)
- **채워진 바**: 모드별 accent 색상
- **높이**: 6px
- **border-radius**: full (9999px)
- **레이블**: `caption` (13px), `muted` 컬러

### 4-8. 카테고리 뱃지 (여행 중 모드)

Airbnb의 "Guest favorite" 플로팅 뱃지 패턴 참조.

- **높이**: 24px
- **패딩**: 4px 12px
- **border-radius**: 9999px (Airbnb full pill)
- **폰트**: 11px / 700, 흰색
- **배경**: `during-category-*` 토큰 사용

### 4-9. 빈 상태 (Empty State)

- **아이콘**: Lucide 아이콘 64px, `surface-strong` 배경 원형
- **타이틀**: `display-md` (20px / 700), `ink`
- **설명**: `body-md`, `muted`
- **CTA**: Primary 버튼

---

## 5. 스페이싱 & 레이아웃

Airbnb의 4px 기반 스페이싱 시스템을 사용합니다.

| 토큰 | 값 | 용도 |
|------|-----|------|
| `spacing-xxs` | 2px | 마이크로 갭 |
| `spacing-xs` | 4px | 아이콘-텍스트 간격 |
| `spacing-sm` | 8px | 컴포넌트 내부 패딩 |
| `spacing-md` | 12px | 카드 내부 패딩 |
| `spacing-base` | 16px | 기본 좌우 패딩 |
| `spacing-lg` | 24px | 섹션 내부 패딩 |
| `spacing-xl` | 32px | 섹션 간격 |
| `spacing-xxl` | 48px | 섹션 간격 (큰) |
| `spacing-section` | 64px | 주요 섹션 간격 |

**레이아웃 규칙:**
- 최대 너비: 480px (모바일 앱 느낌, 가운데 정렬)
- 기본 좌우 패딩: 16px (`spacing-base`)
- TODO 리스트 아이템 간격: 8px (`spacing-sm`)
- 헤더 높이: 56px 고정
- 탭 네비게이션: 48px 고정
- 하단 입력창: 72px 고정 (safe area 포함)

---

## 6. 애니메이션 & 인터랙션

### 모드별 트랜지션 원칙

| 모드 | 인터랙션 스타일 | 지속 시간 | 이징 |
|------|-----------------|-----------|------|
| 여행 전 | 위에서 아래로 슬라이드 인 | 300ms | `ease-out` |
| 여행 중 | 팝 스케일 이펙트 | 200ms | `spring` (cubic-bezier) |
| 여행 후 | 부드러운 페이드 인 | 400ms | `ease-in-out` |

### 공통 마이크로인터랙션

```css
/* TODO 항목 추가 */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 체크 완료 팝 (여행 중 모드) */
@keyframes checkPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 페이드 인 (여행 후 모드) */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### 모드 전환 트랜지션

```css
/* 탭 전환 시 배경색 부드럽게 변경 */
.mode-container {
  transition: background-color 350ms ease-in-out;
}
```

---

## 7. Tailwind CSS 설정값

`tailwind.config.ts`에 아래 설정을 추가합니다.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ----------------------------------------------------------------
      // 폰트
      // ----------------------------------------------------------------
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'system-ui', 'sans-serif'],
      },

      // ----------------------------------------------------------------
      // 색상 — Airbnb 기반 + 3 모드 확장
      // ----------------------------------------------------------------
      colors: {
        // Airbnb 공통 팔레트
        airbnb: {
          rausch:    '#FF385C',
          active:    '#E00B41',
          disabled:  '#FFD1DA',
          canvas:    '#FFFFFF',
          soft:      '#F7F7F7',
          strong:    '#F2F2F2',
          hairline:  '#DDDDDD',
          ink:       '#222222',
          body:      '#3F3F3F',
          muted:     '#6A6A6A',
          error:     '#C13515',
        },
        // 여행 전 (Before) — 설레임 핑크-코랄
        before: {
          bg:              '#FFF5F0',
          'bg-soft':       '#FFE8DC',
          accent:          '#FF385C',
          'accent-active': '#E00B41',
          'accent-light':  '#FFD1DA',
          'accent-glow':   '#FF6B6B',
          hairline:        '#FFCFC7',
          'complete-bg':   '#FFF0F0',
          'complete-text': '#FF9DAD',
          'hero-from':     '#FFF0E6',
          'hero-to':       '#FFE4D6',
        },
        // 여행 중 (During) — 에너지 옐로우-민트
        during: {
          bg:              '#FFFDE7',
          'bg-soft':       '#FFF9C4',
          accent:          '#F59E0B',
          'accent-active': '#D97706',
          'accent-light':  '#FDE68A',
          'accent-glow':   '#FBBF24',
          hairline:        '#FCD34D',
          'complete-bg':   '#F0FDF4',
          'complete-text': '#86EFAC',
          'hero-from':     '#FFFDE7',
          'hero-to':       '#E8F5E9',
          // 카테고리 뱃지
          sightseeing:     '#3B82F6',
          food:            '#EF4444',
          shopping:        '#8B5CF6',
          transport:       '#06B6D4',
          accommodation:   '#10B981',
        },
        // 여행 후 (After) — 차분한 라벤더
        after: {
          bg:              '#F5F3FF',
          'bg-soft':       '#EDE9F6',
          accent:          '#7C3AED',
          'accent-active': '#6D28D9',
          'accent-light':  '#DDD6FE',
          'accent-glow':   '#8B5CF6',
          hairline:        '#C4B5FD',
          'complete-bg':   '#F3F0FF',
          'complete-text': '#A78BFA',
          'hero-from':     '#F3F0FF',
          'hero-to':       '#EDE9F6',
        },
      },

      // ----------------------------------------------------------------
      // 타이포그래피 스케일
      // ----------------------------------------------------------------
      fontSize: {
        'display-xl': ['28px', { lineHeight: '1.43', letterSpacing: '-0.44px', fontWeight: '700' }],
        'display-lg': ['22px', { lineHeight: '1.18', letterSpacing: '-0.44px', fontWeight: '700' }],
        'display-md': ['20px', { lineHeight: '1.4',  letterSpacing: '-0.18px', fontWeight: '700' }],
        'title-md':   ['18px', { lineHeight: '1.25', letterSpacing: '0',       fontWeight: '600' }],
        'title-sm':   ['16px', { lineHeight: '1.25', letterSpacing: '0',       fontWeight: '600' }],
        'body-md':    ['16px', { lineHeight: '1.5',  letterSpacing: '0',       fontWeight: '400' }],
        'body-sm':    ['14px', { lineHeight: '1.43', letterSpacing: '0',       fontWeight: '400' }],
        'caption':    ['13px', { lineHeight: '1.23', letterSpacing: '0',       fontWeight: '500' }],
        'button-md':  ['16px', { lineHeight: '1.25', letterSpacing: '0',       fontWeight: '500' }],
        'nav-link':   ['15px', { lineHeight: '1.25', letterSpacing: '0',       fontWeight: '600' }],
      },

      // ----------------------------------------------------------------
      // 스페이싱 — Airbnb 4px 기반
      // ----------------------------------------------------------------
      spacing: {
        'xxs':     '2px',
        'xs':      '4px',
        'sm':      '8px',
        'md':      '12px',
        'base':    '16px',
        'lg':      '24px',
        'xl':      '32px',
        'xxl':     '48px',
        'section': '64px',
      },

      // ----------------------------------------------------------------
      // 모서리 반경 — Airbnb 라운딩 시스템
      // ----------------------------------------------------------------
      borderRadius: {
        none:  '0',
        xs:    '4px',
        sm:    '8px',    // 버튼, 체크박스
        md:    '14px',   // 카드, 입력창
        lg:    '20px',
        xl:    '32px',
        full:  '9999px', // 진행률 바, 뱃지
      },

      // ----------------------------------------------------------------
      // 박스 그림자 — Airbnb 1-tier 시스템
      // ----------------------------------------------------------------
      boxShadow: {
        none:         'none',
        'card-hover': '0 6px 20px rgba(0,0,0,0.12)',
      },

      // ----------------------------------------------------------------
      // 애니메이션
      // ----------------------------------------------------------------
      keyframes: {
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        checkPop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in':  'slideIn 300ms ease-out',
        'check-pop': 'checkPop 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in':   'fadeIn 400ms ease-in-out',
      },

      // ----------------------------------------------------------------
      // 레이아웃
      // ----------------------------------------------------------------
      maxWidth: {
        app: '480px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 8. CSS 변수 (globals.css)

```css
/* globals.css */

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* 공통 */
  --canvas:         #FFFFFF;
  --surface-soft:   #F7F7F7;
  --surface-strong: #F2F2F2;
  --hairline:       #DDDDDD;
  --border-strong:  #C1C1C1;
  --ink:            #222222;
  --body-text:      #3F3F3F;
  --muted:          #6A6A6A;
  --error:          #C13515;

  /* 여행 전 (Before) */
  --before-bg:              #FFF5F0;
  --before-bg-soft:         #FFE8DC;
  --before-accent:          #FF385C;
  --before-accent-active:   #E00B41;
  --before-accent-light:    #FFD1DA;
  --before-accent-glow:     #FF6B6B;
  --before-hairline:        #FFCFC7;
  --before-complete-bg:     #FFF0F0;
  --before-complete-text:   #FF9DAD;

  /* 여행 중 (During) */
  --during-bg:              #FFFDE7;
  --during-bg-soft:         #FFF9C4;
  --during-accent:          #F59E0B;
  --during-accent-active:   #D97706;
  --during-accent-light:    #FDE68A;
  --during-accent-glow:     #FBBF24;
  --during-hairline:        #FCD34D;
  --during-complete-bg:     #F0FDF4;
  --during-complete-text:   #86EFAC;

  /* 여행 후 (After) */
  --after-bg:               #F5F3FF;
  --after-bg-soft:          #EDE9F6;
  --after-accent:           #7C3AED;
  --after-accent-active:    #6D28D9;
  --after-accent-light:     #DDD6FE;
  --after-accent-glow:      #8B5CF6;
  --after-hairline:         #C4B5FD;
  --after-complete-bg:      #F3F0FF;
  --after-complete-text:    #A78BFA;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont,
               'Segoe UI', sans-serif;
  color: var(--ink);
  background-color: var(--canvas);
  -webkit-font-smoothing: antialiased;
}
```

---

## 9. 모드별 테마 상수 (constants/themes.ts)

```typescript
// constants/themes.ts
export type TripPhase = 'before' | 'during' | 'after'

export interface PhaseTheme {
  bg:           string
  bgSoft:       string
  accent:       string
  accentActive: string
  accentLight:  string
  accentGlow:   string
  hairline:     string
  completeBg:   string
  completeText: string
  heroGradient: string
  heroTitle:    string
  heroSubtitle: string
  heroEmoji:    string
  tabLabel:     string
  animation:    'slide-in' | 'check-pop' | 'fade-in'
}

export const PHASE_THEMES: Record<TripPhase, PhaseTheme> = {
  before: {
    bg:           '#FFF5F0',
    bgSoft:       '#FFE8DC',
    accent:       '#FF385C',
    accentActive: '#E00B41',
    accentLight:  '#FFD1DA',
    accentGlow:   '#FF6B6B',
    hairline:     '#FFCFC7',
    completeBg:   '#FFF0F0',
    completeText: '#FF9DAD',
    heroGradient: 'linear-gradient(180deg, #FFF0E6 0%, #FFE4D6 100%)',
    heroTitle:    '두근두근! 일본 여행 준비 중',
    heroSubtitle: '설레는 여행의 시작, 하나씩 체크해봐요',
    heroEmoji:    '✈️',
    tabLabel:     '여행 전',
    animation:    'slide-in',
  },
  during: {
    bg:           '#FFFDE7',
    bgSoft:       '#FFF9C4',
    accent:       '#F59E0B',
    accentActive: '#D97706',
    accentLight:  '#FDE68A',
    accentGlow:   '#FBBF24',
    hairline:     '#FCD34D',
    completeBg:   '#F0FDF4',
    completeText: '#86EFAC',
    heroGradient: 'linear-gradient(180deg, #FFFDE7 0%, #E8F5E9 100%)',
    heroTitle:    '신나는 일본 여행 중!',
    heroSubtitle: '오늘도 즐거운 하루! 하나씩 정복해봐요',
    heroEmoji:    '📸',
    tabLabel:     '여행 중',
    animation:    'check-pop',
  },
  after: {
    bg:           '#F5F3FF',
    bgSoft:       '#EDE9F6',
    accent:       '#7C3AED',
    accentActive: '#6D28D9',
    accentLight:  '#DDD6FE',
    accentGlow:   '#8B5CF6',
    hairline:     '#C4B5FD',
    completeBg:   '#F3F0FF',
    completeText: '#A78BFA',
    heroGradient: 'linear-gradient(180deg, #F3F0FF 0%, #EDE9F6 100%)',
    heroTitle:    '즐거웠던 일본 여행, 마무리해봐요',
    heroSubtitle: '좋은 추억을 차곡차곡 정리해요',
    heroEmoji:    '📷',
    tabLabel:     '여행 후',
    animation:    'fade-in',
  },
}
```

---

## 10. 아이콘 & 일러스트레이션 스타일

**아이콘 라이브러리:** Lucide React (기획서 권장사항 그대로)

```bash
npm install lucide-react
```

### 주요 아이콘 매핑

| 용도 | Lucide 아이콘 | 크기 |
|------|--------------|------|
| TODO 추가 버튼 | `Plus` | 20px |
| 항목 삭제 | `Trash2` | 16px |
| 체크 완료 | `Check` | 14px |
| 여행 전 탭 | `Plane` | 20px |
| 여행 중 탭 | `MapPin` | 20px |
| 여행 후 탭 | `Home` | 20px |
| 진행률 | `BarChart2` | 16px |
| 설정 | `Settings` | 20px |
| 편집 | `Pencil` | 14px |
| 카테고리: 관광지 | `Landmark` | 16px |
| 카테고리: 맛집 | `UtensilsCrossed` | 16px |
| 카테고리: 쇼핑 | `ShoppingBag` | 16px |
| 카테고리: 교통 | `Train` | 16px |
| 카테고리: 숙소 | `Hotel` | 16px |
| 빈 상태 | `ClipboardList` | 48px |

**일러스트레이션 스타일:**
- 이모지를 적극 활용 (Airbnb의 비주얼 언어와 유사한 따뜻한 표현)
- 모드별 히어로 영역에 대표 이모지 배치 (✈️ / 📸 / 📷)
- 아이콘은 stroke 방식, stroke-width: 1.5 (Lucide 기본값 유지)

---

## 11. 반응형 브레이크포인트

Airbnb 시스템을 모바일 앱 특성에 맞게 조정합니다.

| 이름 | 너비 | 주요 변경 |
|------|------|-----------|
| mobile | < 480px | 기본 레이아웃, 최대 너비 100% |
| mobile-wide | 480px+ | 앱 컨테이너 480px 고정, 가운데 정렬 |
| tablet | 768px+ | 좌우 패딩 확대, 카드 그리드 선택적 2열 |

대부분의 사용이 모바일에서 발생하므로 (기획서 KPI: 모바일 70%+) 480px 이하를 기준 레이아웃으로 설정합니다.

---

## 12. 접근성 체크리스트

Airbnb 시스템의 WCAG AAA 기준을 따릅니다.

- [ ] 모든 Primary CTA 최소 48×48px 터치 타겟
- [ ] 텍스트 대비 비율: `ink` (#222222) / `before-bg` (#FFF5F0) = 10.5:1 (AAA 충족)
- [ ] 텍스트 대비 비율: `ink` (#222222) / `during-bg` (#FFFDE7) = 11.2:1 (AAA 충족)
- [ ] 텍스트 대비 비율: `ink` (#222222) / `after-bg` (#F5F3FF) = 10.8:1 (AAA 충족)
- [ ] 포커스 링: 2px solid 모드별 accent 색상 + 2px offset
- [ ] 체크박스 ARIA: `role="checkbox"`, `aria-checked`, `aria-label`
- [ ] 탭 ARIA: `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] 삭제 버튼 ARIA: `aria-label="항목 삭제"`

---

*작성일: 2026-07-30*
*기반 디자인 시스템: Airbnb (https://getdesign.md/airbnb/design-md)*
*설치: `npx getdesign@latest add airbnb`*
