import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import Member from "@/models/Member";

export async function GET(request: Request) {
    try {
        await connectDB();
        
        // Extract uid from query params
        const url = new URL(request.url);
        const uid = url.searchParams.get("uid");

        if (!uid) {
            return Response.json({ message: "uid is required" }, { status: 400 });
        }

        const rooms = await Room.find({ members: uid });
        return Response.json(rooms);
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to fetch rooms" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, uid } = body;

        if (!name || !uid) {
            return Response.json(
                { message: "name and uid are required" },
                { status: 400 }
            );
        }

        // Generate a random 6-character key
        const key = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = await Room.create({
            name,
            key,
            creator: uid,
            members: [uid],
        });

        // Add this room to the Member's rooms array
        await Member.findOneAndUpdate(
            { uid },
            { $push: { rooms: room._id } },
            { new: true }
        );

        return Response.json(room, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to create room" },
            { status: 500 }
        );
    }
}
