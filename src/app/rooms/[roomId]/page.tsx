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
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Status = "todo" | "up-next" | "in-progress" | "in-review" | "done";

type Task = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: Status;
    assignee?: { uid: string; displayName: string };
};

const COLUMNS: { id: Status; label: string, color: string }[] = [
    { id: "todo", label: "To Do", color: "bg-[#dbeafe]" },
    { id: "up-next", label: "Up Next", color: "bg-[#fef9c3]" },
    { id: "in-progress", label: "In Progress", color: "bg-[#fce7f3]" },
    { id: "in-review", label: "In Review", color: "bg-[#ede9fe]" },
    { id: "done", label: "Done", color: "bg-[#dcfce7]" },
];

export default function RoomBoard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const roomId = params.roomId as string;
    
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [authLoading, user, router]);

    async function fetchTasks() {
        if (!roomId) return;
        const response = await fetch(`/api/tasks?roomId=${roomId}`);
        const data = await response.json();
        setTasks(data);
    }

    useEffect(() => {
        if (user && roomId) {
            fetchTasks();
        }
    }, [user, roomId]);

    async function handleDragEnd(result: DropResult) {
        const { draggableId, destination } = result;

        if (!destination) return;

        const newStatus = destination.droppableId as Status;

        const task = tasks.find((t) => t._id === draggableId);
        if (!task || task.status === newStatus) return;

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
                setTasks((prev) =>
                    prev.map((t) =>
                        t._id === draggableId ? { ...t, status: task.status } : t
                    )
                );
            }
        } catch {
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === draggableId ? { ...t, status: task.status } : t
                )
            );
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <p className="text-black font-black text-2xl tracking-tighter border-4 border-black px-6 py-3 bg-white shadow-[6px_6px_0px_#000]">LOADING…</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f5f5f5] pb-10">
            <Navbar />
            
            <div className="m-6 flex justify-between items-center">
                <Link href="/rooms">
                    <button className="bg-white border-4 border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] transition-all">
                        ← Back to Rooms
                    </button>
                </Link>
                <Link href={`/create-task?roomId=${roomId}`}>
                    <button className="bg-[#bbf7d0] border-4 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] transition-all text-xl">
                        + New Task
                    </button>
                </Link>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 m-6 items-start overflow-x-auto pb-6 px-2">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="flex-1 min-w-[300px]">
                            <h2 className="text-2xl font-black mb-4 text-black border-b-4 border-black pb-2">
                                {col.label}
                            </h2>
                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`min-h-[200px] border-4 border-black shadow-[6px_6px_0px_#000] p-4 flex flex-col gap-4 transition-colors ${col.color} ${
                                            snapshot.isDraggingOver ? "opacity-90" : ""
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
                                                                assignee={task.assignee}
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
        </div>
    );
}
