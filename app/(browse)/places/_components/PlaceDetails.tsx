"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { ReviewContainer } from "../_components/ReviewContainer";
import { AverageRating } from "../../_components/placeInfo/AverageRating";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ReviewForm } from "../_components/ReviewForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface Props {
    placeId: string;
    user: string | null | undefined;
}

interface AuthorType {
    username: string;
    externalUserId: string;
}

interface Image {
    _id: string;
    url: string;
}

interface Review {
    _id: string;
    content: string;
    rating: number;
    author: AuthorType;
}

export interface Place {
    _id: string;
    name: string;
    location: string;
    averageSpent: number;
    images: Image[];
    description: string;
    rating: number;
    reviews: Review[];
    author: AuthorType;
}

export default function PlaceDetails({ placeId, user }: Props) {

    const { toast } = useToast();
    const router = useRouter();

    const placeInitialState = {
        _id: '',
        name: '',
        location: '',
        averageSpent: 0,
        images: [],
        description: '',
        rating: 1,
        reviews: [],
        author: {
            username: '',
            externalUserId: ''
        },
    }

    const [placeInfo, setPlaceInfo] = useState<Place>(placeInitialState);
    const [userData, setUserData] = useState<string>('');

    const navigateToEditPage = () => {
        router.push(`/places/${placeId}/edit`);
    };

    const deletePlace = async () => {
        try {
            await axios.delete(`/api/place/${placeId}`);
            router.push('/');
            toast({
                variant: 'success',
                title: 'Place deleted successfully',
            });
        } catch (error) {
            console.error(error);
            return toast({
                variant: 'error',
                title: 'Something went wrong. Please, try again.',
            });

        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                if (user) {
                    const [placeInfoResponse, userDataResponse] = await Promise.all([
                        axios.get(`/api/place/${placeId}`),
                        axios.get(`/api/user/${user}`),
                    ]);

                    setPlaceInfo(placeInfoResponse.data);
                    setUserData(userDataResponse.data.username);
                } else {
                    const { data } = await axios.get(`/api/place/${placeId}`);
                    setPlaceInfo(data);
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'error',
                    title: 'Something went wrong. Please try again',
                });
            }
        };

        fetchData();

    }, [placeId, user]);

    return (
        <div className="mt-6 flex flex-col lg:flex-row px-6 space-y-8 lg:space-y-0">
            <div className="w-full lg:w-1/2">
                <div className="w-5/6 space-y-3 ml-6 lg:ml-8">
                    <div className="flex justify-between items-center border-b-2">
                        <h1 className="text-2xl font-medium">{placeInfo.name}</h1>
                        <AverageRating rating={placeInfo.rating} />
                    </div>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {placeInfo.images.map((image) => (
                                <CarouselItem key={image._id}>
                                    <div className="flex justify-center p-1">
                                        <Image
                                            src={`${image.url}`}
                                            alt="Place Picture"
                                            height='420'
                                            width='420'
                                            className="rounded-xl"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                    <div className="flex justify-between border-b-2">
                        <h3 className="font-medium">
                            Location
                        </h3>
                        <p className="text-muted-foreground">
                            {placeInfo.location}
                        </p>
                    </div>
                    <div className='flex justify-between border-b-2'>
                        <h3 className="font-medium">
                            Average Spent
                        </h3>
                        <span>
                            ${placeInfo.averageSpent} USD
                        </span>
                    </div>
                    <div className="">
                        <h3 className="font-medium">
                            Description
                        </h3>
                        <p>
                            {placeInfo.description}
                        </p>
                    </div>
                </div>
                {user && user === placeInfo.author?.externalUserId && (
                    <div className="flex items-center gap-6 mt-12">
                        <Button
                            onClick={navigateToEditPage}
                            variant='edit'
                            className="h-[30px] rounded-xl gap-1"
                        >
                            Edit
                            <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={deletePlace}
                            variant='delete'
                            className=' h-[30px] rounded-xl gap-1'
                        >

                            <Trash2Icon className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4">
                <h3 className="w-full text-xl font-medium border-b-2">
                    Reviews
                </h3>
                <div className="w-full h-1/3 flex flex-col items-center overflow-y-scroll space-y-4">
                    {placeInfo.reviews.length > 0 ? (
                        placeInfo.reviews.map((review) => (
                            <ReviewContainer
                                key={review._id}
                                author={review.author?.username}
                                rating={review.rating}
                                content={review.content}
                                authorExtId={review.author.externalUserId}
                                loggedUserId={user}
                                placeId={placeId}
                                reviewId={review._id}
                            />
                        ))
                    ) : (
                        <p>No reviews yet</p>
                    )
                    }
                </div>
                <div className="w-full flex flex-col justify-center border-t-2 space-y-3 py-2">
                    <h4 className="text-md font-medium">
                        Leave A Review
                    </h4>
                    {userData ? (
                        <div className="flex justify-center">
                            <ReviewForm
                                placeId={placeInfo._id}
                                author={userData}
                                authorId={user}
                            />
                        </div>
                    ) : (
                        <div className='flex justify-center mt-3'>
                            <p className="">You must be signed in to leave a review</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};