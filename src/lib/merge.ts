import { TodosByPhase, TodoItem, TripPhase, MissionItem } from "./types";

const PHASES: TripPhase[] = ["before", "during", "after"];

/**
 * 3-way merge: base(마지막으로 동기화된 상태) vs local(내 변경) vs server(서버 최신)
 * - 추가: local에만 있는 항목 → 서버 데이터에 추가
 * - 삭제: base에 있었는데 local에 없는 항목 → 서버 데이터에서 제거
 * - 체크: base 대비 local에서 완료 상태가 바뀐 항목 → 서버 데이터에 반영
 */
export function mergeTodos(
  base: TodosByPhase,
  local: TodosByPhase,
  server: TodosByPhase
): TodosByPhase {
  const merged = {
    before: [] as TodoItem[],
    during: [] as TodoItem[],
    after: [] as TodoItem[],
  };

  for (const phase of PHASES) {
    const baseItems = base[phase];
    const localItems = local[phase];
    const serverItems = server[phase];

    const baseIds = new Set(baseItems.map((i) => i.id));
    const localIds = new Set(localItems.map((i) => i.id));

    // 내가 추가한 항목 (base에 없고 local에 있음)
    const added = localItems.filter((i) => !baseIds.has(i.id));

    // 내가 삭제한 항목 (base에 있었는데 local에 없음)
    const deleted = new Set(
      baseItems.filter((i) => !localIds.has(i.id)).map((i) => i.id)
    );

    // 내가 토글한 항목 (base 대비 완료 상태 변경)
    const toggled = new Map<
      string,
      { completed: boolean; completedAt: string | null }
    >();
    for (const item of localItems) {
      const baseItem = baseItems.find((b) => b.id === item.id);
      if (baseItem && baseItem.completed !== item.completed) {
        toggled.set(item.id, {
          completed: item.completed,
          completedAt: item.completedAt,
        });
      }
    }

    // 서버 데이터에 내 변경사항 적용
    const result = serverItems
      .filter((i) => !deleted.has(i.id))
      .map((i) => {
        const toggle = toggled.get(i.id);
        return toggle ? { ...i, ...toggle } : i;
      });

    // 내가 추가한 항목은 맨 앞에
    merged[phase] = [...added, ...result];
  }

  return merged;
}

/**
 * 미션 3-way merge. 투두와 같은 추가/삭제/체크 규칙에 메모 변경을 더한다.
 * - 메모: 아들/아빠 칸을 따로 비교한다. 한 사람이 자기 칸만 고쳤으면
 *   상대가 같은 카드의 다른 칸에 쓴 내용은 그대로 살아남는다.
 */
export function mergeMissions(
  base: MissionItem[],
  local: MissionItem[],
  server: MissionItem[]
): MissionItem[] {
  const baseIds = new Set(base.map((i) => i.id));
  const localIds = new Set(local.map((i) => i.id));
  const baseById = new Map(base.map((i) => [i.id, i]));

  // 내가 추가한 카드 (base에 없고 local에 있음)
  const added = local.filter((i) => !baseIds.has(i.id));

  // 내가 삭제한 카드 (base에 있었는데 local에 없음)
  const deleted = new Set(
    base.filter((i) => !localIds.has(i.id)).map((i) => i.id)
  );

  // 내가 바꾼 필드만 추려둔다
  const edits = new Map<string, Partial<MissionItem>>();
  for (const item of local) {
    const baseItem = baseById.get(item.id);
    if (!baseItem) continue;
    const patch: Partial<MissionItem> = {};
    if (baseItem.completed !== item.completed) {
      patch.completed = item.completed;
      patch.completedAt = item.completedAt;
    }
    if (baseItem.noteSon !== item.noteSon) {
      patch.noteSon = item.noteSon;
    }
    if (baseItem.noteDad !== item.noteDad) {
      patch.noteDad = item.noteDad;
    }
    if (Object.keys(patch).length > 0) edits.set(item.id, patch);
  }

  const result = server
    .filter((i) => !deleted.has(i.id))
    .map((i) => {
      const patch = edits.get(i.id);
      return patch ? { ...i, ...patch } : i;
    });

  return [...added, ...result];
}
