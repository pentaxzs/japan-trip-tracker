"use client";

import { useEffect, useState } from "react";

const TEXT_FIELDS = "input, textarea, [contenteditable]";

/** 지금 글자를 입력하는 칸에 포커스가 있나 */
function isTypingTarget(el: Element | null): boolean {
  return !!el && el.matches?.(TEXT_FIELDS);
}

/**
 * 키보드가 화면 아래를 가린 높이(px).
 *
 * iOS는 키보드가 올라와도 레이아웃 뷰포트가 그대로다. 보이는 영역만 줄어든다.
 * 그래서 `sticky bottom-0`은 키보드 뒤에 붙고, iOS가 포커스된 입력을 보이게
 * 하려고 페이지를 끌어올리면 입력줄 아래로 목록이 비친다.
 *
 * 높이는 innerHeight - visualViewport.height 로만 잰다.
 * offsetTop을 섞으면 고무줄 스크롤(맨 아래에서 더 당기기, 맨 위에서 당기기)에
 * 출렁이는 값이 들어와 키보드도 없는데 입력줄이 위로 솟는다.
 *
 * 입력칸에 포커스가 있을 때만 적용한다. 주소창이 접히거나 하는 다른 이유로
 * 보이는 높이가 변할 때 입력줄이 따라 움직이면 안 된다.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!isTypingTarget(document.activeElement)) {
          setInset(0);
          return;
        }
        const hidden = window.innerHeight - vv.height;
        // 1px 미만은 반올림 오차라 무시한다
        setInset(hidden > 1 ? Math.round(hidden) : 0);
      });
    };

    update();
    vv.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  return inset;
}
