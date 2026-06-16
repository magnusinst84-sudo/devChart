"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthPage() {
    const router = useRouter();
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isSignup) {
                const cred = await createUserWithEmailAndPassword(auth, email, password);

                if (displayName.trim()) {
                    await updateProfile(cred.user, { displayName: displayName.trim() });
                }

                await fetch("/api/members", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: cred.user.uid,
                        displayName: displayName.trim() || email,
                        email,
                    }),
                });

                router.push("/dashboard");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                router.push("/dashboard");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
            <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_#000] rounded-none overflow-hidden">
                {/* Header */}
                <div className="bg-[#000] p-6 text-center border-b-4 border-black">
                    <h1 className="text-4xl font-black text-white tracking-tight">devChart</h1>
                    <p className="text-[#fef08a] font-bold text-lg mt-2 uppercase">
                        {isSignup ? "Create your account" : "Sign in"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
                    {error && (
                        <div className="bg-[#fecaca] border-2 border-black text-black font-bold p-3">
                            {error}
                        </div>
                    )}

                    {isSignup && (
                        <div>
                            <label className="block text-lg font-black text-black mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                                className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-lg font-black text-black mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-black text-black mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full border-2 border-black rounded-none px-4 py-3 text-lg font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] bg-[#f5f5f5] transition-shadow"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#bbf7d0] text-black font-black text-xl px-6 py-4 border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_#000] disabled:opacity-50 transition-all uppercase tracking-tight"
                    >
                        {loading
                            ? "Please wait…"
                            : isSignup
                            ? "Sign Up"
                            : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-black font-bold mt-4">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError("");
                            }}
                            className="text-black underline decoration-4 underline-offset-4 hover:bg-black hover:text-white transition-colors px-1"
                        >
                            {isSignup ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
