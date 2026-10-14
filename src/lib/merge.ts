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

/** 내가 고쳤는지 base와 비교해 필드별로 가져오는 항목들 */
const EDITABLE_FIELDS = [
  "day",
  "moment",
  "lens",
  "story",
  "prompt",
] as const satisfies readonly (keyof MissionItem)[];

/**
 * 메모는 참여자별로 비교한다. 내가 안 건드린 사람의 메모는 patch에 담지 않아서
 * 서버에 있는 상대 메모가 살아남는다.
 */
function mergeNotes(
  base: Record<string, string>,
  local: Record<string, string>
): Record<string, string> | null {
  const changed: Record<string, string> = {};
  let any = false;
  for (const id of new Set([...Object.keys(base ?? {}), ...Object.keys(local ?? {})])) {
    const b = base?.[id] ?? "";
    const l = local?.[id] ?? "";
    if (b !== l) {
      changed[id] = l;
      any = true;
    }
  }
  return any ? changed : null;
}

/** 필드 하나를 base와 비교해 바뀌었으면 patch에 담는다 */
function copyIfChanged<K extends (typeof EDITABLE_FIELDS)[number]>(
  patch: Partial<MissionItem>,
  base: MissionItem,
  local: MissionItem,
  field: K
): void {
  if (base[field] !== local[field]) {
    patch[field] = local[field];
  }
}

/**
 * 미션 3-way merge. 투두와 같은 추가/삭제/체크 규칙에 메모 변경을 더한다.
 * - 메모: 참여자별로 따로 비교한다. 한 사람이 자기 칸만 고쳤으면
 *   다른 사람이 같은 카드에 쓴 내용은 그대로 살아남는다.
 * - 카드 내용(제목/관점/이야기/질문)도 같은 방식으로 필드별 비교한다.
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
    for (const field of EDITABLE_FIELDS) {
      copyIfChanged(patch, baseItem, item, field);
    }

    const notes = mergeNotes(baseItem.notes, item.notes);
    if (notes) patch.notes = notes;
    if (Object.keys(patch).length > 0) edits.set(item.id, patch);
  }

  const result = server
    .filter((i) => !deleted.has(i.id))
    .map((i) => {
      const patch = edits.get(i.id);
      if (!patch) return i;
      // notes는 통째로 갈아끼우면 상대 메모가 날아간다 — 바뀐 키만 덮는다
      const notes = patch.notes ? { ...i.notes, ...patch.notes } : i.notes;
      return { ...i, ...patch, notes };
    });

  return [...added, ...result];
}
