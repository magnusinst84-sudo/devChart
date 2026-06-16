import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
});

// Delete cached model so Next.js hot-reload always picks up the latest schema.
delete mongoose.models["Member"];
const Member = mongoose.model("Member", MemberSchema);

export default Member;
