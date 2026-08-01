"use client";

import { useState, useEffect, useRef } from "react";
import { ClipboardList } from "lucide-react";
import { TodoItem as TodoItemType, TripPhase } from "@/lib/types";
import TodoItemComponent from "./TodoItem";

interface TodoListProps {
  todos: TodoItemType[];
  phase: TripPhase;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  phase,
  onToggle,
  onDelete,
}: TodoListProps) {
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const prevIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(todos.map((t) => t.id));
    // Only animate if exactly one new item was added (not tab switch)
    if (prevIdsRef.current.size > 0 && currentIds.size === prevIdsRef.current.size + 1) {
      const newId = todos.find((t) => !prevIdsRef.current.has(t.id))?.id;
      if (newId) {
        setNewItemId(newId);
        const timer = setTimeout(() => setNewItemId(null), 500);
        prevIdsRef.current = currentIds;
        return () => clearTimeout(timer);
      }
    }
    prevIdsRef.current = currentIds;
  }, [todos]);

  if (todos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-[16px] py-[48px] gap-[16px]">
        <div
          className="w-16 h-16 flex items-center justify-center"
          style={{
            borderRadius: "9999px",
            backgroundColor: "var(--surface-strong)",
          }}
        >
          <ClipboardList size={32} strokeWidth={1.5} style={{ color: "var(--muted)" }} />
        </div>
        <div className="text-center">
          <p
            className="text-display-md mb-[4px]"
            style={{ color: "var(--ink)" }}
          >
            할 일이 없어요
          </p>
          <p
            className="text-body-md"
            style={{ color: "var(--muted)" }}
          >
            아래에서 새 할 일을 추가해보세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-[16px] pb-[16px]">
      <div className="flex flex-col gap-[8px]">
        {todos.map((item) => (
          <TodoItemComponent
            key={item.id}
            item={item}
            phase={phase}
            onToggle={onToggle}
            onDelete={onDelete}
            isNew={item.id === newItemId}
          />
        ))}
      </div>
    </div>
  );
}
