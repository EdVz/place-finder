import React from 'react'
import { AverageRating } from '../../_components/placeInfo/AverageRating'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast, useToast } from '@/components/ui/use-toast';

interface ReviewContainerProps {
    author: string;
    rating: number;
    content: string;
    authorExtId: string;
    loggedUserId: string | null | undefined;
    placeId: string;
    reviewId: string;
}

export const ReviewContainer = ({
    author,
    rating,
    content,
    authorExtId,
    loggedUserId,
    placeId,
    reviewId,
}: ReviewContainerProps) => {

    const { toast } = useToast();

    const deleteReview = async () => {
        try {
            await axios.delete(`/api/place/${placeId}/reviews/${reviewId}`);
            window.location.reload();
            return toast({
                variant: 'success',
                title: 'Review was successfully deleted',
            });

        } catch (error) {
            console.error(error);
            return toast({
                variant: 'error',
                title: 'Something went wrong. Please, try again',
            });
        }
    };

    return (
        <div
            className='w-full lg:w-3/4 h-auto py-3 px-6 space-y-3 text-sm border border-gray-400 rounded-xl shadow-md'
        >
            <div className='flex gap-6'>
                <h3 className='font-medium'>
                    {author}
                </h3>
                <AverageRating rating={rating} />
            </div>
            <div className='w-full'>
                <p className='w-full whitespace-pre-line'>
                    {content}
                </p>
            </div>
            {loggedUserId === authorExtId && (
                <Button
                    onClick={deleteReview}
                    variant='delete'
                    className='w-[60px] h-[30px] rounded-xl'
                >
                    Delete
                </Button>
            )}
        </div>
    )
}
