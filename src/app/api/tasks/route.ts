import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export async function GET(){
    try{
        await connectDB();

        const tasks = await Task.find();

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
        const { title, description, priority, status, assignee } = body;

        const task = await Task.create({ title, description, priority, status, assignee });

        return Response.json(task,{status: 201});
    }catch(error){
        console.log(error);
        return Response.json(
            {message:"Failed to create task"},
            {status: 500}
        );
    }
}