"use client";

import { useEffect, useState } from "react";

/**
 * 키보드가 화면 아래를 가린 높이(px).
 *
 * iOS는 키보드가 올라와도 레이아웃 뷰포트가 그대로다. 보이는 영역만 줄어든다.
 * 그래서 `sticky bottom-0`은 키보드 뒤에 붙고, iOS가 포커스된 입력을 보이게
 * 하려고 페이지를 끌어올리면 입력줄 아래로 목록이 비친다.
 *
 * visualViewport로 실제 가려진 높이를 재서, 그만큼 입력줄을 올리는 데 쓴다.
 * 키보드가 없으면 0이라 데스크톱과 안드로이드에서는 아무 일도 하지 않는다.
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
        const hidden = window.innerHeight - vv.height - vv.offsetTop;
        // 1px 미만은 주소창이 접히는 등의 잔떨림이라 무시한다
        setInset(hidden > 1 ? Math.round(hidden) : 0);
      });
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}
