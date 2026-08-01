"use client";

import { useState, useEffect, useCallback } from "react";
import { JapanTripData, TodoItem, TripPhase } from "@/lib/types";
import { loadTripData, saveTripData, archiveTrip, resetTripData } from "@/lib/storage";

export function useTodos() {
  const [data, setData] = useState<JapanTripData | null>(null);
  const [phase, setPhase] = useState<TripPhase>("before");

  // Hydrate from LocalStorage after mount
  useEffect(() => {
    setData(loadTripData());
  }, []);

  // Persist to LocalStorage on every change
  useEffect(() => {
    if (data) {
      saveTripData(data);
    }
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

  const endTrip = useCallback(() => {
    if (!data) return;
    archiveTrip(data);
    const fresh = resetTripData();
    setData(fresh);
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
