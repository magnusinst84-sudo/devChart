import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import { Types } from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        await connectDB();

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return Response.json({ message: "Invalid task id" }, { status: 400 });
        }

        const task = await Task.findById(id);

        if (!task) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }

        return Response.json(task);
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to fetch task" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        await connectDB();

        const { id } = await params;

        if (!Types.ObjectId.isValid(id)) {
            return Response.json({ message: "Invalid task id" }, { status: 400 });
        }

        const body = await request.json();
        const { status, assignee } = body;

        // Build the update operations
        const setFields: Record<string, unknown> = {};
        const pushFields: Record<string, unknown> = {};

        // Handle status update
        if (status !== undefined) {
            const validStatuses = ["todo", "up-next", "in-progress", "in-review", "done"];
            if (!validStatuses.includes(status)) {
                return Response.json({ message: "Invalid status value" }, { status: 400 });
            }

            // Fetch current task to capture the previous status
            const existing = await Task.findById(id);
            if (!existing) {
                return Response.json({ message: "Task not found" }, { status: 404 });
            }

            const previousStatus = existing.status as string;

            const logEntry = {
                action: "status changed",
                from: previousStatus,
                to: status,
                timestamp: new Date(),
            };
            console.log("[PATCH] Pushing activityLog entry:", logEntry);

            setFields.status = status;
            pushFields.activityLog = logEntry;
        }

        // Handle assignee update
        if (assignee !== undefined) {
            setFields.assignee = assignee;
        }

        const updateOps: Record<string, unknown> = {};
        if (Object.keys(setFields).length > 0) updateOps.$set = setFields;
        if (Object.keys(pushFields).length > 0) updateOps.$push = pushFields;

        if (Object.keys(updateOps).length === 0) {
            return Response.json({ message: "No valid fields to update" }, { status: 400 });
        }

        const updated = await Task.findByIdAndUpdate(id, updateOps, { new: true });

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
