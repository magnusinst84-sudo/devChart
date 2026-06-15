type TaskCardProps = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
};

const TaskCard = ({ title, description, priority }: TaskCardProps) => {
    const bgClass =
        priority.toLowerCase() === "high"
            ? "bg-red-400"
            : priority.toLowerCase() === "medium"
            ? "bg-yellow-400"
            : "bg-green-400";

    return (
        <div className={`flex h-auto w-full self-start flex-col rounded-2xl border-2 border-black overflow-hidden shrink-0 ${bgClass}`}>
            <div className="bg-black p-3 text-xl font-bold text-teal-200">
                <h2>{title}</h2>
            </div>

            <div className="p-3">
                <div className="rounded-xl border border-black bg-teal-200 p-3 text-sm wrap-break-words">
                    {description}
                </div>
            </div>
        </div>
    );
};


export default TaskCard;
