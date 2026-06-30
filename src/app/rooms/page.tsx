"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Room {
    _id: string;
    name: string;
    key: string;
    creator: string;
    members: string[];
}

export default function RoomsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newRoomName, setNewRoomName] = useState("");
    const [joinRoomKey, setJoinRoomKey] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    const fetchRooms = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/rooms?uid=${user.uid}`);
            if (res.ok) {
                const data = await res.json();
                setRooms(data);
            }
        } catch (err) {
            console.error("Failed to fetch rooms:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRooms();
        }
    }, [user]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!newRoomName.trim() || !user) return;

        try {
            const res = await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newRoomName, uid: user.uid }),
            });
            if (res.ok) {
                setNewRoomName("");
                fetchRooms();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to create room");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!joinRoomKey.trim() || !user) return;

        try {
            const res = await fetch("/api/rooms/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: joinRoomKey, uid: user.uid }),
            });
            if (res.ok) {
                setJoinRoomKey("");
                fetchRooms();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to join room");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    if (loading || isLoading) {
        return <div className="min-h-screen bg-white text-black p-8 font-black text-2xl">LOADING...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white text-black font-sans p-8" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-12 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_#000]">
                    <h1 className="text-4xl font-black uppercase">Your Rooms</h1>
                    <div className="text-lg font-bold">Hello, {user.displayName}</div>
                </header>

                {error && (
                    <div className="bg-[#fecaca] border-4 border-black p-4 shadow-[4px_4px_0px_#000] mb-8 font-bold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Create Room */}
                    <div className="bg-[#bbf7d0] border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
                        <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Create a Room</h2>
                        <form onSubmit={handleCreateRoom} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Room Name"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                className="p-3 border-4 border-black focus:outline-none font-bold text-lg"
                                required
                            />
                            <button type="submit" className="bg-white border-4 border-black p-3 font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-transform">
                                Create
                            </button>
                        </form>
                    </div>

                    {/* Join Room */}
                    <div className="bg-[#fef08a] border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
                        <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Join a Room</h2>
                        <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Room Key"
                                value={joinRoomKey}
                                onChange={(e) => setJoinRoomKey(e.target.value)}
                                className="p-3 border-4 border-black focus:outline-none font-bold text-lg"
                                required
                            />
                            <button type="submit" className="bg-white border-4 border-black p-3 font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-transform">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <h2 className="text-3xl font-black uppercase mb-6 bg-white inline-block border-4 border-black p-3 shadow-[4px_4px_0px_#000]">My Rooms</h2>
                
                {rooms.length === 0 ? (
                    <div className="bg-white border-4 border-black p-8 text-center text-xl font-bold shadow-[8px_8px_0px_#000]">
                        You haven't joined any rooms yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <Link href={`/rooms/${room._id}`} key={room._id}>
                                <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#000] transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase mb-2">{room.name}</h3>
                                        <p className="font-bold text-gray-700">Members: {room.members.length}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t-4 border-black">
                                        <p className="font-black text-sm uppercase">Key: <span className="bg-[#fef08a] px-2 py-1 border-2 border-black">{room.key}</span></p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
