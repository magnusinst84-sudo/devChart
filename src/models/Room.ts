import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
    },
    creator: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Delete cached model so Next.js hot-reload always picks up the latest schema.
delete mongoose.models["Room"];
const Room = mongoose.model("Room", RoomSchema);

export default Room;
