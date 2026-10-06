"use client";

import { useRef, TouchEvent } from "react";

/** 이만큼은 가로로 움직여야 스와이프로 친다 */
const MIN_DISTANCE = 60;
/** 세로보다 가로가 이 배수만큼 커야 한다 — 스크롤을 뺏지 않으려고 */
const AXIS_RATIO = 1.5;
/** 천천히 끄는 동작은 스와이프가 아니다 */
const MAX_DURATION = 800;

/**
 * 여기서 시작한 터치는 무시한다.
 * 입력 요소는 커서를 옮기거나 글을 고르는 중일 수 있고,
 * data-no-swipe는 수정 중인 미션 카드가 단다 (탭이 바뀌면 쓰던 내용이 날아간다).
 */
const IGNORE_SELECTOR =
  "input, textarea, select, button, a, [contenteditable], [data-no-swipe]";

interface Start {
  x: number;
  y: number;
  at: number;
}

/**
 * 좌우 스와이프로 탭을 넘긴다.
 * onSwipe(1)은 다음 탭, onSwipe(-1)은 이전 탭.
 */
export function useSwipeTabs(onSwipe: (direction: 1 | -1) => void) {
  const start = useRef<Start | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    start.current = null;
    // 두 손가락은 확대/스크롤이지 스와이프가 아니다
    if (e.touches.length !== 1) return;

    const target = e.target as HTMLElement | null;
    if (target?.closest?.(IGNORE_SELECTOR)) return;

    const touch = e.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, at: Date.now() };
  };

  const onTouchEnd = (e: TouchEvent) => {
    const from = start.current;
    start.current = null;
    if (!from) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - from.x;
    const dy = touch.clientY - from.y;

    if (Date.now() - from.at > MAX_DURATION) return;
    if (Math.abs(dx) < MIN_DISTANCE) return;
    if (Math.abs(dx) < Math.abs(dy) * AXIS_RATIO) return;

    // 왼쪽으로 밀면 다음 탭 (종이를 넘기는 방향)
    onSwipe(dx < 0 ? 1 : -1);
  };

  const onTouchCancel = () => {
    start.current = null;
  };

  return { onTouchStart, onTouchEnd, onTouchCancel };
}
