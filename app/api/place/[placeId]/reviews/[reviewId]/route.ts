import Place from "@/app/_models/Place";
import Review from "@/app/_models/Review";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { PlaceId: string, reviewId: string } }) {
    try {
        await Place.findByIdAndUpdate(params.PlaceId, {
            $pull: {
                reviews: params.reviewId
            }
        });
        await Review.findByIdAndDelete(params.reviewId);

        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}