import Link from "next/link";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center h-auto font-black bg-[#000000] text-white p-4 border-b-4 border-black">
            <Link href="/">
                <h1 className="text-3xl tracking-tight">devChart</h1>
            </Link>
            <div className="flex gap-4">
                <Link href="/dashboard">
                    <button className="rounded-none py-1.5 px-4 bg-white text-black font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
                        DashBoard
                    </button>
                </Link>
                <Link href="/create-task">
                    <button className="rounded-none py-1.5 px-4 bg-white text-black font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
                        Create Task
                    </button>
                </Link>
            </div>
        </div>
    );
}