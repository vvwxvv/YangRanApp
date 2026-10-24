"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * SortableCardGrid
 *
 * A drag-and-drop grid wrapper (same layout as GridViewLayout) used by the
 * manager's per-group reorder mode. Each child is wrapped in a sortable item;
 * on drop it calls `onReorder(newItems)` with the array moved.
 */

function SortableItem({ id, dragDisabled, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 50 : "auto",
    cursor: dragDisabled ? "default" : "grab",
    touchAction: "none",
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function SortableCardGrid({
  items = [],
  Component,
  componentProps = {},
  onReorder,
  disabled = false,
  gridClassName = "",
  style = {},
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = items.map((it) => it.id || it._id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder?.(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div
          className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${gridClassName}`}
          style={style}
        >
          {items.map((item, idx) => {
            const id = item.id || item._id || idx;
            return (
              <SortableItem key={id} id={id} dragDisabled={disabled}>
                <Component item={item} {...componentProps} />
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
