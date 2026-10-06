"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JapanTripData, TodoItem, TripPhase, MissionItem } from "@/lib/types";
import {
  fetchTripData,
  saveTripDataToServer,
  archiveTripToServer,
  createInitialData,
} from "@/lib/storage";
import { mergeTodos, mergeMissions } from "@/lib/merge";
import { createCustomMission } from "@/lib/templates";
import { TabKey, isPhase } from "@/constants/themes";

const POLL_INTERVAL = 5000;

export function useTodos() {
  const [data, setData] = useState<JapanTripData | null>(null);
  const [tab, setTabState] = useState<TabKey>("before");
  // 미션 탭에 가 있어도 투두는 마지막으로 보던 단계를 유지한다
  const [phase, setPhase] = useState<TripPhase>("before");
  const [hasUpdate, setHasUpdate] = useState(false);
  const [wasMerged, setWasMerged] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedAt = useRef<string | null>(null);
  const baseData = useRef<JapanTripData | null>(null);
  const skipNextSave = useRef(false);

  // Load from server on mount
  useEffect(() => {
    fetchTripData().then((loaded) => {
      lastSavedAt.current = loaded.updatedAt;
      baseData.current = loaded;
      setData(loaded);
    });
  }, []);

  // Debounced save to server on data change
  const isInitialLoad = useRef(true);
  useEffect(() => {
    if (!data) return;
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const now = new Date().toISOString();

      // 충돌 감지: 서버의 updatedAt이 내가 마지막으로 알고 있는 것과 다른지 확인
      try {
        const checkRes = await fetch("/api/todos/check");
        const { updatedAt: serverUpdatedAt } = await checkRes.json();

        if (
          serverUpdatedAt &&
          lastSavedAt.current &&
          serverUpdatedAt !== lastSavedAt.current &&
          baseData.current
        ) {
          // 충돌 발생 → 서버 데이터 가져와서 자동 병합
          const serverData = await fetchTripData();
          const mergedTodos = mergeTodos(
            baseData.current.todos,
            data.todos,
            serverData.todos
          );
          const mergedMissions = mergeMissions(
            baseData.current.missions,
            data.missions,
            serverData.missions
          );

          const mergedData: JapanTripData = {
            ...serverData,
            todos: mergedTodos,
            missions: mergedMissions,
            updatedAt: now,
          };

          lastSavedAt.current = now;
          baseData.current = mergedData;
          await saveTripDataToServer(mergedData);

          // 병합된 결과로 로컬 업데이트 (재저장 방지)
          skipNextSave.current = true;
          setData(mergedData);
          setHasUpdate(false);
          setWasMerged(true);
          return;
        }
      } catch {
        // 체크 실패 시 그냥 저장
      }

      // 충돌 없음 → 정상 저장
      const saveData = { ...data, updatedAt: now };
      lastSavedAt.current = now;
      baseData.current = saveData;
      await saveTripDataToServer(saveData);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data]);

  // Poll for remote changes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/todos/check");
        const { updatedAt } = await res.json();
        if (
          updatedAt &&
          lastSavedAt.current &&
          updatedAt !== lastSavedAt.current
        ) {
          setHasUpdate(true);
        }
      } catch {
        // ignore
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // 병합 토스트 자동 닫기 (3초)
  useEffect(() => {
    if (!wasMerged) return;
    const timer = setTimeout(() => setWasMerged(false), 3000);
    return () => clearTimeout(timer);
  }, [wasMerged]);

  const refreshData = useCallback(async () => {
    const fresh = await fetchTripData();
    lastSavedAt.current = fresh.updatedAt;
    baseData.current = fresh;
    skipNextSave.current = true;
    setData(fresh);
    setHasUpdate(false);
  }, []);

  const currentTodos = data?.todos[phase] ?? [];

  const addTodo = useCallback(
    (text: string) => {
      if (!data) return;
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 200) return;

      const newItem: TodoItem = {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        category: "default",
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      setData({
        ...data,
        todos: {
          ...data.todos,
          [phase]: [newItem, ...data.todos[phase]],
        },
      });
    },
    [data, phase]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      if (!data) return;

      setData({
        ...data,
        todos: {
          ...data.todos,
          [phase]: data.todos[phase].map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed: !item.completed,
                  completedAt: !item.completed
                    ? new Date().toISOString()
                    : null,
                }
              : item
          ),
        },
      });
    },
    [data, phase]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      if (!data) return;

      setData({
        ...data,
        todos: {
          ...data.todos,
          [phase]: data.todos[phase].filter((item) => item.id !== id),
        },
      });
    },
    [data, phase]
  );

  const updateTripInfo = useCallback(
    (updates: Partial<JapanTripData["tripInfo"]>) => {
      if (!data) return;
      setData({
        ...data,
        tripInfo: { ...data.tripInfo, ...updates },
      });
    },
    [data]
  );

  const setTab = useCallback((next: TabKey) => {
    setTabState(next);
    if (isPhase(next)) setPhase(next);
  }, []);

  const missions = data?.missions ?? [];

  // 새로 만든 카드는 바로 수정 모드로 열어준다 (제목부터 쓰게)
  const [newMissionId, setNewMissionId] = useState<string | null>(null);

  const addMission = useCallback(
    (day: number) => {
      if (!data) return;
      const created = createCustomMission(day);
      setNewMissionId(created.id);
      setData({ ...data, missions: [...data.missions, created] });
    },
    [data]
  );

  const toggleMission = useCallback(
    (id: string) => {
      if (!data) return;
      setData({
        ...data,
        missions: data.missions.map((m) =>
          m.id === id
            ? {
                ...m,
                completed: !m.completed,
                completedAt: !m.completed ? new Date().toISOString() : null,
              }
            : m
        ),
      });
    },
    [data]
  );

  const updateMissionNote = useCallback(
    (id: string, field: "noteSon" | "noteDad", note: string) => {
      if (!data) return;
      setData({
        ...data,
        missions: data.missions.map((m) =>
          m.id === id ? { ...m, [field]: note.slice(0, 1000) } : m
        ),
      });
    },
    [data]
  );

  const editMission = useCallback(
    (
      id: string,
      draft: Pick<MissionItem, "day" | "moment" | "lens" | "story" | "prompt">
    ) => {
      if (!data) return;
      setNewMissionId(null);
      setData({
        ...data,
        missions: data.missions.map((m) =>
          m.id === id
            ? {
                ...m,
                day: draft.day,
                moment: draft.moment.slice(0, 100),
                lens: draft.lens.slice(0, 200),
                story: draft.story.slice(0, 1000),
                prompt: draft.prompt.slice(0, 1000),
              }
            : m
        ),
      });
    },
    [data]
  );

  const deleteMission = useCallback(
    (id: string) => {
      if (!data) return;
      setNewMissionId(null);
      setData({ ...data, missions: data.missions.filter((m) => m.id !== id) });
    },
    [data]
  );

  const endTrip = useCallback(async () => {
    if (!data) return;
    await archiveTripToServer(data);
    const fresh = createInitialData();
    skipNextSave.current = true;
    setData(fresh);
    baseData.current = fresh;
    lastSavedAt.current = fresh.updatedAt;
    await saveTripDataToServer(fresh);
    setPhase("before");
    setTabState("before");
  }, [data]);

  const completedCount = currentTodos.filter((t) => t.completed).length;
  const totalCount = currentTodos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const missionCompletedCount = missions.filter((m) => m.completed).length;
  const missionTotalCount = missions.length;
  const missionProgress =
    missionTotalCount === 0
      ? 0
      : Math.round((missionCompletedCount / missionTotalCount) * 100);

  return {
    tab,
    setTab,
    phase,
    setPhase,
    todos: currentTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    completedCount,
    totalCount,
    progress,
    isLoaded: data !== null,
    tripInfo: data?.tripInfo ?? { title: "일본 여행", destination: "tokyo", departureDate: null, returnDate: null },
    updateTripInfo,
    endTrip,
    hasUpdate,
    refreshData,
    wasMerged,
    missions,
    addMission,
    toggleMission,
    updateMissionNote,
    editMission,
    deleteMission,
    newMissionId,
    missionCompletedCount,
    missionTotalCount,
    missionProgress,
  };
}
