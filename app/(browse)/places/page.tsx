"use client"

import { useEffect, useState } from "react";
import { PlaceCard } from "../(home)/_components/PlaceCard";
import axios from "axios";
import { Place } from "../(home)/page";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ClipLoader from 'react-spinners/Cliploader';

export default function AllPlaces({ searchParams }: { searchParams: { name: string } }) {

    const [places, setPlaces] = useState<Place[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {

        const fetchSearchedPlaces = async () => {
            try {
                if (searchParams.name) {
                    setLoading(true);
                    const { data } = await axios.get(`/api/place?name=${searchParams.name}`);
                    setLoading(false);
                    setPlaces(data);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error(error);
                return toast({
                    variant: 'error',
                    title: 'Something went wrong. Please, try again'
                });
            }
        };

        fetchSearchedPlaces();
    }, [searchParams]);

    return (
        <div className="w-full mt-8">
            <div className="flex flex-col lg:flex-row flex-wrap gap-3 justify-evenly">
                {loading ? (
                    <div className="flex justify-center">
                        <ClipLoader />
                    </div>
                ) : (
                    places && (
                        places.length > 0 ? (
                            places.map(place => (
                                <PlaceCard
                                    key={place._id}
                                    id={place._id}
                                    name={place.name}
                                    images={place.images}
                                    location={place.location}
                                    rating={place.rating}
                                    averageSpent={place.averageSpent}
                                    description={place.description}

                                />
                            ))
                        ) : (
                            <h3 className="text-xl mt-6">
                                No matches found for '{searchParams.name}'.
                            </h3>
                        )
                    )
                )}

            </div>
        </div>
    );
};