import Place from "@/app/_models/Place";
import Review from "@/app/_models/Review";
import User from "@/app/_models/User";
import { NextResponse } from "next/server";

interface newReview {
    rating: number;
    content: string;
    author: string;
    authorId: string;
}

export async function POST(req: Request, { params }: { params: { placeId: string } }) {
    const body: newReview = await req.json();

    if (!body.rating || !body.content) {
        return NextResponse.json({ message: 'Please Enter All The Fields' }, { status: 400 });
    }

    if (!body.author || !body.authorId) {
        return NextResponse.json({ message: 'Missing author' }, { status: 500 })
    }

    try {
        const place = await Place.findById(params.placeId);
        if (!place) {
            return NextResponse.json({ message: 'Place Not Found' }, { status: 400 });
        }

        const user = await User.findOne({ externalUserId: body.authorId });
        if (!user) {
            return NextResponse.json({ message: 'Author not found' }, { status: 400 });
        }

        const review = await Review.create({
            author: user._id,
            rating: body.rating,
            content: body.content
        });
        place.reviews.push(review);
        await review.save();
        await place.save();

        return NextResponse.json({ message: 'Review created successfuly' }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'There was an error creating review', error }, { status: 500 });
    }
}