"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Member = {
    _id: string;
    uid: string;
    displayName: string;
    email: string;
};

const CreateTaskContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const { user, loading: authLoading } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("low");
    const [assigneeUid, setAssigneeUid] = useState("");
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        async function fetchMembers() {
            const res = await fetch("/api/members");
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        }
        if (user) {
            fetchMembers();
        }
    }, [user]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        try {
            const selectedMember = members.find((m) => m.uid === assigneeUid);
            const assignee = selectedMember
                ? { uid: selectedMember.uid, displayName: selectedMember.displayName }
                : undefined;

            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    status: "todo",
                    roomId,
                    ...(assignee && { assignee }),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            if (roomId) {
                router.push(`/rooms/${roomId}`);
            } else {
                router.push("/rooms");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
        } finally {
            setLoading(false);
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
            
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
                <h1 className="text-4xl font-black mb-8 text-black border-b-4 border-black pb-4">
                    Create a new task
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block font-black text-black mb-2 text-xl">Task Name</label>
                        <input
                            type="text"
                            placeholder="Enter task name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow"
                        />
                    </div>

                    <div>
                        <label className="block font-black text-black mb-2 text-xl">Description</label>
                        <textarea
                            placeholder="Describe the task"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow resize-y"
                        />
                    </div>

                    <div>
                        <label className="block font-black text-black mb-2 text-xl">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            required
                            className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow appearance-none cursor-pointer"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-black text-black mb-2 text-xl">Assign To</label>
                        <select
                            value={assigneeUid}
                            onChange={(e) => setAssigneeUid(e.target.value)}
                            className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow appearance-none cursor-pointer"
                        >
                            <option value="">Unassigned</option>
                            {members.map((m) => (
                                <option key={m.uid} value={m.uid}>
                                    {m.displayName || m.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-[#fef08a] text-black font-black text-2xl px-6 py-4 border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_#000] disabled:opacity-50 transition-all uppercase tracking-tight"
                    >
                        {loading ? "Creating…" : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function CreateTask() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">Loading...</div>}>
            <CreateTaskContent />
        </Suspense>
    );
}