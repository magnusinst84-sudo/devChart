"use client";

import { useState, useEffect } from "react";

type Comment = {
    _id?: string;
    author: string;
    text: string;
    createdAt: string | Date;
};

type ActivityLogEntry = {
    _id?: string;
    action: string;
    from: string;
    to: string;
    timestamp: string | Date;
};

type Assignee = {
    uid: string;
    displayName: string;
};

type Member = {
    _id: string;
    uid: string;
    displayName: string;
    email: string;
};

type TaskCardProps = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee?: Assignee;
};

const TaskCard = ({ _id, title, description, priority, status, assignee }: TaskCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
    const [currentAssignee, setCurrentAssignee] = useState<Assignee | undefined>(assignee);
    const [members, setMembers] = useState<Member[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setCurrentAssignee(assignee);
    }, [assignee]);

    const bgClass =
        priority.toLowerCase() === "high"
            ? "bg-[#fecaca]"
            : priority.toLowerCase() === "medium"
            ? "bg-[#fef08a]"
            : "bg-[#bbf7d0]";

    async function openModal() {
        setModalOpen(true);
        setLoadingComments(true);
        try {
            const [taskRes, membersRes] = await Promise.all([
                fetch(`/api/tasks/${_id}`),
                fetch("/api/members"),
            ]);
            if (taskRes.ok) {
                const data = await taskRes.json();
                setComments(data.comments ?? []);
                setActivityLog(data.activityLog ?? []);
                setCurrentAssignee(data.assignee ?? undefined);
            }
            if (membersRes.ok) {
                const membersData = await membersRes.json();
                setMembers(membersData);
            }
        } finally {
            setLoadingComments(false);
        }
    }

    async function handleAssigneeChange(uid: string) {
        if (uid === "") {
            const res = await fetch(`/api/tasks/${_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignee: null }),
            });
            if (res.ok) {
                setCurrentAssignee(undefined);
            }
            return;
        }

        const member = members.find((m) => m.uid === uid);
        if (!member) return;

        const newAssignee = { uid: member.uid, displayName: member.displayName };
        const res = await fetch(`/api/tasks/${_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignee: newAssignee }),
        });
        if (res.ok) {
            setCurrentAssignee(newAssignee);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!author.trim() || !text.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/tasks/${_id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author: author.trim(), text: text.trim() }),
            });
            if (res.ok) {
                const updated = await res.json();
                setComments(updated.comments ?? []);
                setAuthor("");
                setText("");
            }
        } finally {
            setSubmitting(false);
        }
    }

    function formatDate(value: string | Date): string {
        const d = new Date(value);
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <>
            {/* Card Face */}
            <div
                onClick={openModal}
                className="flex h-auto w-full self-start flex-col rounded-none border-2 border-black overflow-hidden shrink-0 cursor-pointer bg-white shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
            >
                <div className="p-3 bg-white">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h2 className="text-xl font-black text-black leading-tight break-words">{title}</h2>
                        <span className={`px-2 py-0.5 text-xs font-bold border-2 border-black whitespace-nowrap ${bgClass}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                    </div>
                    <div className="text-sm font-bold break-words text-gray-800">
                        {description}
                    </div>
                    {currentAssignee && (
                        <p className="text-xs font-extrabold text-black mt-3 pt-2 border-t-2 border-black">
                            👤 {currentAssignee.displayName}
                        </p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="relative bg-white border-4 border-black shadow-[8px_8px_0px_#000] rounded-none w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="bg-[#f5f5f5] p-4 flex items-start justify-between gap-2 border-b-4 border-black">
                            <h2 className="text-2xl font-black text-black break-words">{title}</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-black hover:text-gray-700 text-3xl font-black leading-none shrink-0 ml-2"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6 bg-white">
                            {/* Meta */}
                            <div className="flex gap-2 flex-wrap">
                                <span
                                    className={`px-3 py-1 text-sm font-bold border-2 border-black ${bgClass}`}
                                >
                                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                                </span>
                                <span className="px-3 py-1 text-sm font-bold border-2 border-black bg-[#f5f5f5]">
                                    {status}
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-black text-lg text-black mb-1">Description</h3>
                                <p className="text-base text-black bg-white border-2 border-black p-3 font-bold break-words">
                                    {description}
                                </p>
                            </div>

                            {/* Assign To */}
                            <div>
                                <h3 className="font-black text-lg text-black mb-1">
                                    Assign To
                                </h3>
                                <select
                                    value={currentAssignee?.uid ?? ""}
                                    onChange={(e) => handleAssigneeChange(e.target.value)}
                                    className="w-full border-2 border-black rounded-none px-3 py-2 text-sm font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-white transition-shadow cursor-pointer"
                                >
                                    <option value="">Unassigned</option>
                                    {members.map((m) => (
                                        <option key={m.uid} value={m.uid}>
                                            {m.displayName || m.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Comments */}
                            <div>
                                <h3 className="font-black text-lg text-black mb-2">
                                    Comments {comments.length > 0 && `(${comments.length})`}
                                </h3>
                                {loadingComments ? (
                                    <p className="text-sm font-bold text-gray-500">Loading…</p>
                                ) : comments.length === 0 ? (
                                    <p className="text-sm font-bold text-gray-500 italic">No comments yet.</p>
                                ) : (
                                    <ul className="flex flex-col gap-4">
                                        {comments.map((c, i) => (
                                            <li
                                                key={c._id ?? i}
                                                className="bg-white border-2 border-black p-3"
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-2 border-b-2 border-black pb-2">
                                                    <span className="font-black text-black">{c.author}</span>
                                                    <span className="text-xs font-bold text-black shrink-0">
                                                        {formatDate(c.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-black font-bold break-words">{c.text}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Activity Log */}
                            <div>
                                <h3 className="font-black text-lg text-black mb-2">
                                    Activity Log
                                </h3>
                                {activityLog.length === 0 ? (
                                    <p className="text-sm font-bold text-gray-500 italic">No activity yet.</p>
                                ) : (
                                    <ul className="flex flex-col gap-3">
                                        {[...activityLog].reverse().map((entry, i) => (
                                            <li
                                                key={entry._id ?? i}
                                                className="flex flex-col gap-1 bg-[#f5f5f5] border-2 border-black px-3 py-2 text-sm font-bold"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className="text-black">
                                                        Status changed from{" "}
                                                        <span className="font-black uppercase">{entry.from}</span>
                                                        {" "}to{" "}
                                                        <span className="font-black uppercase">{entry.to}</span>
                                                    </span>
                                                </div>
                                                <span className="text-xs text-black">
                                                    {formatDate(entry.timestamp)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Add comment form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t-4 border-black pt-4 mt-2">
                                <h3 className="font-black text-lg text-black">Add a comment</h3>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="border-2 border-black rounded-none px-3 py-2 text-sm font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] transition-shadow"
                                    required
                                />
                                <textarea
                                    placeholder="Write a comment…"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={3}
                                    className="border-2 border-black rounded-none px-3 py-2 text-sm font-bold resize-none focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] transition-shadow"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="self-end bg-black text-white font-black px-6 py-2 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] disabled:opacity-50 transition-all"
                                >
                                    {submitting ? "Posting…" : "Submit"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskCard;
