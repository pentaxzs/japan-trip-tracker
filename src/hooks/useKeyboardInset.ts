"use client";

import { RefObject, useEffect, useState } from "react";

const TEXT_FIELDS = "input, textarea, [contenteditable]";

/** 지금 글자를 입력하는 칸에 포커스가 있나 */
function isTypingTarget(el: Element | null): boolean {
  return !!el && el.matches?.(TEXT_FIELDS);
}

/**
 * 입력줄이 보이는 영역 아래로 얼마나 밀려났는지(px).
 *
 * 키보드 높이를 추정해서 그만큼 올리면 안 된다. iOS는 포커스된 칸을 보이게
 * 하려고 페이지를 스스로 끌어올리는데, 거기에 또 올리면 두 번 올라가 솟구친다.
 *
 * 그래서 추정하지 않고 "이 요소가 실제로 얼마나 가려졌는지"를 잰다.
 *   가려진 양 = 보정을 뺀 입력줄 바닥 − 보이는 영역 바닥
 * iOS가 이미 올려놨으면 0이 나와 아무 일도 하지 않고, 키보드 뒤에 숨어
 * 있으면 딱 그만큼만 올라온다. 어느 쪽이든 결과가 같다.
 *
 * 입력칸에 포커스가 있을 때만 잰다. 주소창이 접히거나 고무줄 스크롤로
 * 보이는 높이가 출렁일 때 입력줄이 따라 움직이면 안 된다.
 */
export function useKeyboardInset(ref: RefObject<HTMLElement | null>): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let frame = 0;
    let current = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el || !isTypingTarget(document.activeElement)) {
          current = 0;
          setInset(0);
          return;
        }
        // 지금 걸려 있는 보정을 되돌려 원래 바닥을 구한다 (되먹임 방지)
        const naturalBottom = el.getBoundingClientRect().bottom + current;
        const visibleBottom = vv.offsetTop + vv.height;
        const hidden = Math.round(naturalBottom - visibleBottom);
        current = hidden > 1 ? hidden : 0;
        setInset(current);
      });
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, [ref]);

  return inset;
}
