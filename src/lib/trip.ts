import { TripInfo } from "./types";

/** 1박2일 ~ 13박14일 */
export const MIN_NIGHTS = 1;
export const MAX_NIGHTS = 13;

export const NIGHT_PRESETS = [1, 2, 3, 4];

const DAY_MS = 86400000;

export function nightsLabel(nights: number): string {
  return `${nights}박${nights + 1}일`;
}

export function clampNights(nights: number): number {
  return Math.min(Math.max(Math.round(nights), MIN_NIGHTS), MAX_NIGHTS);
}

/**
 * 이 여행이 몇 박인지.
 * 출발일과 귀국일이 둘 다 있으면 그게 사실이고, 없을 때만 저장해둔 값을 쓴다.
 * 날짜와 nights가 따로 놀지 않도록 읽는 쪽은 항상 이 함수를 거친다.
 */
export function tripNights(info: TripInfo): number {
  if (info.departureDate && info.returnDate) {
    const dep = new Date(info.departureDate);
    const ret = new Date(info.returnDate);
    if (!Number.isNaN(dep.getTime()) && !Number.isNaN(ret.getTime())) {
      const nights = Math.round((ret.getTime() - dep.getTime()) / DAY_MS);
      if (nights >= MIN_NIGHTS) return Math.min(nights, MAX_NIGHTS);
    }
  }
  return clampNights(info.nights ?? 2);
}

/** 미션 날차 개수 — 1박2일이면 2일차까지 */
export function tripDayCount(info: TripInfo): number {
  return tripNights(info) + 1;
}

/**
 * 기간을 바꿀 때 여행 정보에 적용할 변경분.
 * 출발일이 있으면 귀국일을 다시 계산해 날짜와 기간이 어긋나지 않게 한다.
 */
export function nightsPatch(info: TripInfo, nights: number): Partial<TripInfo> {
  const safe = clampNights(nights);
  if (!info.departureDate) return { nights: safe };

  const dep = new Date(info.departureDate);
  if (Number.isNaN(dep.getTime())) return { nights: safe };

  dep.setDate(dep.getDate() + safe);
  const returnDate = `${dep.getFullYear()}-${String(dep.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dep.getDate()).padStart(2, "0")}`;
  return { nights: safe, returnDate };
}
