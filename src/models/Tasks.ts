import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ActivityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const TaskSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["todo", "up-next", "in-progress", "in-review", "done"],
        default: "todo",
    },
    comments: {
        type: [CommentSchema],
        default: [],
    },
    activityLog: {
        type: [ActivityLogSchema],
        default: [],
    },
    assignee: {
        uid: { type: String },
        displayName: { type: String },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Delete cached model so Next.js hot-reload always picks up the latest schema.
delete mongoose.models["Task"];
const Task = mongoose.model("Task", TaskSchema);

export default Task;