import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { Types } from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        await connectDB();

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return Response.json({ message: "Invalid task id" }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        const validStatuses = ["todo", "in-progress", "done"];
        if (!validStatuses.includes(status)) {
            return Response.json({ message: "Invalid status value" }, { status: 400 });
        }

        const updated = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }

        return Response.json(updated);
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        await connectDB();

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return Response.json({ message: "Invalid task id" }, { status: 400 });
        }

        const deleted = await Task.findByIdAndDelete(id);

        if (!deleted) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }

        return Response.json({ message: "Task deleted" });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to delete task" }, { status: 500 });
    }
}
