"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JapanTripData, TodoItem, TripPhase } from "@/lib/types";
import {
  fetchTripData,
  saveTripDataToServer,
  archiveTripToServer,
  createInitialData,
} from "@/lib/storage";

export function useTodos() {
  const [data, setData] = useState<JapanTripData | null>(null);
  const [phase, setPhase] = useState<TripPhase>("before");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from server on mount
  useEffect(() => {
    fetchTripData().then(setData);
  }, []);

  // Debounced save to server on data change
  useEffect(() => {
    if (!data) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTripDataToServer(data);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data]);

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

  const endTrip = useCallback(async () => {
    if (!data) return;
    await archiveTripToServer(data);
    const fresh = createInitialData();
    setData(fresh);
    await saveTripDataToServer(fresh);
    setPhase("before");
  }, [data]);

  const completedCount = currentTodos.filter((t) => t.completed).length;
  const totalCount = currentTodos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
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
  };
}
