import User from "@/app/_models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {

    try {
        const user = await User.findOne({ externalUserId: params.userId });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error', error: error }, { status: 500 });
    }

};