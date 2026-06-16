import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET() {
    try {
        await connectDB();
        const members = await Member.find();
        return Response.json(members);
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to fetch members" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { uid, displayName, email } = body;

        if (!uid || !email) {
            return Response.json(
                { message: "uid and email are required" },
                { status: 400 }
            );
        }

        // Upsert: create if not exists, update if exists
        const member = await Member.findOneAndUpdate(
            { uid },
            { uid, displayName, email },
            { upsert: true, new: true }
        );

        return Response.json(member, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to create member" },
            { status: 500 }
        );
    }
}
