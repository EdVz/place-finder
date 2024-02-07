import Place from "@/app/_models/Place";
import User from "@/app/_models/User";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

interface Image {
    url: string;
}

interface newPlace {
    name: string;
    location: string;
    averageSpent: string;
    images: Image[];
    description: string;
    rating: string;
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("name");

    try {
        if (query) {
            const matchedPlaces = await Place.find({
                name: { $regex: query, $options: "i" }
            })
                .sort({ createdAt: -1 });

            if (!matchedPlaces) {
                return NextResponse.json({ message: 'No place matchde' }, { status: 200 });
            }

            return NextResponse.json(matchedPlaces, { status: 200 });
        }

        const places = await Place.find().sort({ createdAt: -1 });
        return NextResponse.json(places, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error', error }, { status: 500 })
    }
};

export async function POST(req: Request) {
    const body: newPlace = await req.json();

    if (!body.name || !body.location || !body.averageSpent || !body.images || !body.description || !body.rating) {
        return NextResponse.json({ message: 'Please Enter All The Fields' }, { status: 400 });
    }

    const geoData = await geocoder.forwardGeocode({
        query: body.location,
        limit: 1
    }).send();

    const user = await currentUser();

    try {
        const foundUser = await User.findOne({ externalUserId: user?.id });

        const place = await Place.create({
            name: body.name,
            location: body.location,
            geometry: geoData.body.features[0].geometry,
            averageSpent: body.averageSpent,
            description: body.description,
            rating: body.rating,
            author: foundUser,
        });
        const mappedImages = body.images.map(image => ({ url: image }));
        place.images = mappedImages;

        await place.save();
        console.log(place);



        return NextResponse.json({ message: "Place created successfully", placeId: place._id }, { status: 201 });

    } catch (error) {
        // console.error(error);
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
};



