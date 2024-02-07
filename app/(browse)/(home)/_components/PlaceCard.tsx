import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'
import { ArrowRight, StarIcon } from 'lucide-react';
import { Poppins } from 'next/font/google'
import Link from 'next/link';
import React from 'react'
import { AverageRating } from '../../_components/placeInfo/AverageRating';
import Image from 'next/image';
import { ImageType } from '../page';

const font = Poppins({
    subsets: ['latin'],
    weight: ['200', "300", "400", "500", "600", "700", "800"]
});

interface PlaceCardProps {
    id: string,
    name: string;
    images: ImageType[];
    location: string;
    rating: number;
    averageSpent: number;
    description: string;
}

export const PlaceCard = ({ id, name, images, location, rating, averageSpent, description }: PlaceCardProps) => {


    return (
        <div className={cn('h-[550px] w-full max-w-[600px] lg:w-1/4 border rounded-xl shadow-lg py-3 px-6 mb-6 flex flex-col justify-between gap-3', font.className)}>
            <h3 className={cn("text-lg", font.className)}>
                {name}
            </h3>
            <Image
                src={`${images[0].url}`}
                alt='Place Image'
                height='400'
                width='400'
                className='rounded-xl'
            />
            <div className='flex justify-between items-center'>
                <p className='text-sm'>
                    {location}
                </p>
                <AverageRating rating={rating} />
            </div>
            <div>
                <p>
                    Average Spent
                </p>
                <p className='text-sm'>
                    {averageSpent} USD
                </p>
            </div>
            <div className='mb-4'>
                <p className='mb-1'>
                    Description
                </p>
                <p className='text-sm text-gray-500'>
                    {description.length > 150 ? (
                        description.substring(0, 125) + '...'
                    ) : (
                        description
                    )}
                </p>
            </div>
            <div className='flex justify-end'>
                <Link href={`/places/${id}`} className='w-1/2'>
                    <Button
                        size='sm'
                        className='w-full bg-[#3772FF] text-white rounded-xl hover:opacity-75 flex gap-1'
                    >
                        See more
                        <ArrowRight className='h-5 w-5' />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
