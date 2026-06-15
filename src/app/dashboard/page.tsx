"use client";

import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import React, { useState, useEffect } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

type Status = "todo" | "in-progress" | "done";

type Task = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: Status;
};

const COLUMNS: { id: Status; label: string }[] = [
    { id: "todo", label: "To Do" },
    { id: "in-progress", label: "In Progress" },
    { id: "done", label: "Done" },
];

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);

    async function fetchTasks() {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data);
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    async function handleDragEnd(result: DropResult) {
        const { draggableId, destination } = result;

        // Dropped outside any column or in the same column
        if (!destination) return;

        const newStatus = destination.droppableId as Status;

        const task = tasks.find((t) => t._id === draggableId);
        if (!task || task.status === newStatus) return;

        // Optimistic update
        setTasks((prev) =>
            prev.map((t) =>
                t._id === draggableId ? { ...t, status: newStatus } : t
            )
        );

        try {
            const res = await fetch(`/api/tasks/${draggableId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                // Roll back on failure
                setTasks((prev) =>
                    prev.map((t) =>
                        t._id === draggableId ? { ...t, status: task.status } : t
                    )
                );
            }
        } catch {
            // Roll back on network error
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === draggableId ? { ...t, status: task.status } : t
                )
            );
        }
    }

    return (
        <>
            <Navbar />
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 m-4 items-start">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold mb-3 text-teal-200">
                                {col.label}
                            </h2>
                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`min-h-32 rounded-2xl p-3 flex flex-col gap-3 transition-colors ${
                                            snapshot.isDraggingOver
                                                ? "bg-teal-900/40"
                                                : "bg-black/20"
                                        }`}
                                    >
                                        {tasks
                                            .filter((t) => t.status === col.id)
                                            .map((task, index) => (
                                                <Draggable
                                                    key={task._id}
                                                    draggableId={task._id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <TaskCard
                                                                _id={task._id}
                                                                title={task.title}
                                                                description={task.description}
                                                                priority={task.priority}
                                                                status={task.status}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </>
    );
}