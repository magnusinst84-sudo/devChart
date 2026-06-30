import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export async function GET(request: Request){
    try{
        await connectDB();
        
        const url = new URL(request.url);
        const roomId = url.searchParams.get("roomId");

        if (!roomId) {
            return Response.json({ message: "roomId is required" }, { status: 400 });
        }

        const tasks = await Task.find({ roomId });

        return Response.json(tasks);

    }catch(error){

        console.log(error);

        return Response.json(
            {message:"Failed to fetch tasks"},
            {status: 500}
        );
    }
}

export async function POST(request: Request){
    try{
        await connectDB();

        const body = await request.json();
        const { title, description, priority, status, assignee, roomId } = body;

        if (!roomId) {
            return Response.json({ message: "roomId is required" }, { status: 400 });
        }

        const task = await Task.create({ title, description, priority, status, assignee, roomId });

        return Response.json(task,{status: 201});
    }catch(error){
        console.log(error);
        return Response.json(
            {message:"Failed to create task"},
            {status: 500}
        );
    }
}