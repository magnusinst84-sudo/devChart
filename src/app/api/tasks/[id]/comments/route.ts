import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { Types } from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        await connectDB();

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return Response.json({ message: "Invalid task id" }, { status: 400 });
        }

        const body = await request.json();
        const { author, text } = body;

        if (!author || !text) {
            return Response.json(
                { message: "author and text are required" },
                { status: 400 }
            );
        }

        const updated = await Task.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments: { author, text, createdAt: new Date() },
                },
            },
            { new: true }
        );

        if (!updated) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }

        return Response.json(updated);
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to add comment" }, { status: 500 });
    }
}
