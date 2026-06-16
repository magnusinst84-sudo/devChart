import Link from "next/link";

export default function Home() {
    return (
        <div 
            className="min-h-screen text-black font-sans"
            style={{
                backgroundColor: "#ffffff",
                backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
                backgroundSize: "20px 20px"
            }}
        >
            {/* 1. NAVBAR */}
            <nav className="flex justify-between items-center bg-[#000000] text-white p-4 border-b-4 border-black">
                <div className="text-3xl font-black tracking-tight">devChart</div>
                <Link href="/auth">
                    <button className="rounded-none py-2 px-6 bg-white text-black font-black border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_#000] transition-all uppercase">
                        Login
                    </button>
                </Link>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                <div className="inline-block bg-[#fef08a] border-4 border-black shadow-[8px_8px_0px_#000] p-6 mb-8 transform -rotate-2">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-black">
                        The Kanban board built for dev teams
                    </h1>
                </div>
                <p className="text-xl md:text-2xl font-bold mb-12 max-w-3xl mx-auto text-black leading-relaxed bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000]">
                    Track tasks, log activity, collaborate with your team — all in one place
                </p>
                <Link href="/auth">
                    <button className="rounded-none py-4 px-10 text-2xl bg-[#bbf7d0] text-black font-black border-4 border-black shadow-[8px_8px_0px_#000] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_#000] transition-all uppercase">
                        Get Started
                    </button>
                </Link>
            </section>

            {/* 3. FEATURES SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-4xl md:text-5xl font-black mb-10 text-black border-b-4 border-black pb-4 inline-block bg-white px-4 shadow-[4px_4px_0px_#000]">
                    Everything you need
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-2 transition-transform">
                        <h3 className="text-2xl font-black mb-3 text-black">5-Stage Workflow</h3>
                        <p className="text-lg font-bold text-gray-800 leading-snug">
                            To Do → Up Next → In Progress → In Review → Done
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-2 transition-transform">
                        <h3 className="text-2xl font-black mb-3 text-black">Drag & Drop</h3>
                        <p className="text-lg font-bold text-gray-800 leading-snug">
                            Move tasks between stages instantly, changes saved automatically
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-2 transition-transform">
                        <h3 className="text-2xl font-black mb-3 text-black">Comments</h3>
                        <p className="text-lg font-bold text-gray-800 leading-snug">
                            Discuss tasks inline, every comment saved with author and timestamp
                        </p>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-2 transition-transform">
                        <h3 className="text-2xl font-black mb-3 text-black">Activity Log</h3>
                        <p className="text-lg font-bold text-gray-800 leading-snug">
                            Every status change automatically recorded with a full history
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-4xl md:text-5xl font-black mb-12 text-black border-b-4 border-black pb-4 inline-block bg-[#fce7f3] px-4 shadow-[4px_4px_0px_#000]">
                    How it works
                </h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] relative mt-6 md:mt-0">
                        <div className="absolute -top-6 -left-6 bg-black text-white text-3xl font-black p-3 border-4 border-black shadow-[4px_4px_0px_#000]">01</div>
                        <h3 className="text-2xl font-black mt-4 mb-2 text-black">Create a task</h3>
                        <p className="text-lg font-bold text-gray-800">
                            Add a title, description, priority and assign it to a team member
                        </p>
                    </div>
                    <div className="flex-1 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] relative mt-10 md:mt-0">
                        <div className="absolute -top-6 -left-6 bg-black text-white text-3xl font-black p-3 border-4 border-black shadow-[4px_4px_0px_#000]">02</div>
                        <h3 className="text-2xl font-black mt-4 mb-2 text-black">Move it through stages</h3>
                        <p className="text-lg font-bold text-gray-800">
                            Drag cards across the board as work progresses
                        </p>
                    </div>
                    <div className="flex-1 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] relative mt-10 md:mt-0">
                        <div className="absolute -top-6 -left-6 bg-black text-white text-3xl font-black p-3 border-4 border-black shadow-[4px_4px_0px_#000]">03</div>
                        <h3 className="text-2xl font-black mt-4 mb-2 text-black">Track everything</h3>
                        <p className="text-lg font-bold text-gray-800">
                            Comments and activity logs keep the whole team in sync
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. DEMO PREVIEW SECTION */}
            <section className="max-w-7xl mx-auto px-6 py-16 overflow-hidden">
                <h2 className="text-4xl md:text-5xl font-black mb-10 text-black border-b-4 border-black pb-4 text-center">
                    See it in action
                </h2>

                <div className="bg-white border-4 border-black p-6 shadow-[12px_12px_0px_#000] overflow-x-auto">
                    <div className="flex gap-4 min-w-[1200px]">
                        {/* To Do Column */}
                        <div className="flex-1 bg-[#dbeafe] border-4 border-black p-4 shadow-[4px_4px_0px_#000] min-h-[400px]">
                            <h3 className="text-xl font-black mb-4 border-b-4 border-black pb-2 text-black">To Do</h3>
                            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-lg leading-tight">Setup MongoDB</span>
                                    <span className="px-2 py-0.5 bg-[#fecaca] text-xs font-black border-2 border-black">HIGH</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Connect Mongoose and create schemas.</p>
                            </div>
                            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-lg leading-tight">Design Logo</span>
                                    <span className="px-2 py-0.5 bg-[#bbf7d0] text-xs font-black border-2 border-black">LOW</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Create a simple brutalist logo for the app.</p>
                            </div>
                        </div>

                        {/* Up Next Column */}
                        <div className="flex-1 bg-[#fef9c3] border-4 border-black p-4 shadow-[4px_4px_0px_#000] min-h-[400px]">
                            <h3 className="text-xl font-black mb-4 border-b-4 border-black pb-2 text-black">Up Next</h3>
                            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-lg leading-tight">Add AuthContext</span>
                                    <span className="px-2 py-0.5 bg-[#fef08a] text-xs font-black border-2 border-black">MEDIUM</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Wrap layout with Firebase auth provider.</p>
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div className="flex-1 bg-[#fce7f3] border-4 border-black p-4 shadow-[4px_4px_0px_#000] min-h-[400px]">
                            <h3 className="text-xl font-black mb-4 border-b-4 border-black pb-2 text-black">In Progress</h3>
                            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-lg leading-tight">DnD Implementation</span>
                                    <span className="px-2 py-0.5 bg-[#fecaca] text-xs font-black border-2 border-black">HIGH</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Use @hello-pangea/dnd for drag and drop.</p>
                                <p className="text-xs font-black mt-3 pt-2 border-t-2 border-black uppercase">👤 Tanmay</p>
                            </div>
                        </div>

                        {/* In Review Column */}
                        <div className="flex-1 bg-[#ede9fe] border-4 border-black p-4 shadow-[4px_4px_0px_#000] min-h-[400px]">
                            <h3 className="text-xl font-black mb-4 border-b-4 border-black pb-2 text-black">In Review</h3>
                            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-lg leading-tight">API Routes</span>
                                    <span className="px-2 py-0.5 bg-[#fef08a] text-xs font-black border-2 border-black">MEDIUM</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Review POST and PATCH handlers.</p>
                            </div>
                        </div>

                        {/* Done Column */}
                        <div className="flex-1 bg-[#dcfce7] border-4 border-black p-4 shadow-[4px_4px_0px_#000] min-h-[400px]">
                            <h3 className="text-xl font-black mb-4 border-b-4 border-black pb-2 text-black">Done</h3>
                            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-black text-lg leading-tight">Project Setup</span>
                                    <span className="px-2 py-0.5 bg-[#bbf7d0] text-xs font-black border-2 border-black">LOW</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Initialize Next.js app with Tailwind.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="bg-[#000000] text-white text-center p-8 border-t-4 border-black mt-10">
                <p className="font-black text-lg tracking-wide uppercase">
                    devChart
                </p>
            </footer>
        </div>
    );
}