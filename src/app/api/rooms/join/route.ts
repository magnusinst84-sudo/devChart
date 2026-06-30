import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import Member from "@/models/Member";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { key, uid } = body;

        if (!key || !uid) {
            return Response.json(
                { message: "key and uid are required" },
                { status: 400 }
            );
        }

        // Find the room by key
        const room = await Room.findOne({ key: key.toUpperCase() });

        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        // Check if member already in room
        if (room.members.includes(uid)) {
            return Response.json(
                { message: "You are already a member of this room" },
                { status: 400 }
            );
        }

        // Add user to room's members array
        room.members.push(uid);
        await room.save();

        // Add room to user's rooms array
        await Member.findOneAndUpdate(
            { uid },
            { $addToSet: { rooms: room._id } },
            { new: true }
        );

        return Response.json(room, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to join room" },
            { status: 500 }
        );
    }
}
