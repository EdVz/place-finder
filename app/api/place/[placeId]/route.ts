import Place from "@/app/_models/Place";
import { NextResponse } from "next/server";

interface newPlace {
    name: string;
    location: string;
    averageSpent: string;
    images: string[];
    description: string;
    rating: string;
}

export async function GET(req: Request, { params }: { params: { placeId: string } }) {

    try {
        let place = await Place.findById(params.placeId)
            .populate({
                path: "reviews",
                populate: {
                    path: 'author',
                    model: 'User'
                }
            }).populate("author");

        // console.log(JSON.stringify(place, null, 2));

        if (!place) {
            return NextResponse.json({ message: 'Place not found' }, { status: 400 });
        }

        return NextResponse.json(place, { status: 200 });
    } catch (error) {
        console.log('Error', error);
        return NextResponse.json({ message: 'Error', error }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { placeId: string } }) {
    const body: newPlace = await req.json();

    if (!body.name || !body.location || !body.averageSpent || !body.description || !body.rating) {
        return NextResponse.json({ message: 'Please Enter All The Fields' }, { status: 400 });
    }

    try {
        const place = await Place.findByIdAndUpdate(params.placeId, {
            name: body.name,
            location: body.location,
            averageSpent: body.averageSpent,
            description: body.description,
            rating: body.rating,
        })

        if (body.images.length > 0) {
            const mappedImages = body.images.map(image => ({ url: image }));
            place.images = mappedImages;
            await place.save();

            return NextResponse.json({ message: 'Place updated successfully', placeId: place._id }, { status: 200 });
        }

        return NextResponse.json({ message: 'Place updated successfully', placeId: place._id }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { placeId: string } }) {
    try {
        await Place.findByIdAndDelete(params.placeId);
        return NextResponse.json({ message: 'Place deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

    }
};