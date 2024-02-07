import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { StarIcon } from 'lucide-react'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Place } from './PlaceDetails'

interface ReviewFormProps {
    placeId: string;
    author: string | null;
    authorId: string | null | undefined;
}

interface Review {
    rating: number;
    content: string;
    author: string | null;
    authorId: string | null | undefined;
}

export const ReviewForm = ({ placeId, author, authorId }: ReviewFormProps) => {

    const { toast } = useToast();

    const InitialReviewData = {
        rating: 1,
        content: '',
        author: author,
        authorId: authorId
    };

    const [formData, setFormData] = useState<Review>(InitialReviewData);

    const handleChange = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = ev.target.value;
        const name = ev.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitReview = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (!formData.rating || !formData.content) {
            return toast({
                variant: 'reminder',
                title: 'Please fill all the fields',
            });
        }

        try {
            await axios.post(`/api/place/${placeId}/reviews`, formData);

            toast({
                variant: 'success',
                title: 'Review posted successfully'
            });
            window.location.reload();
        } catch (error) {
            return toast({
                variant: 'error',
                title: 'Somethin went wrong. Please, try again',
            });
        }
    };

    return (
        <div className='w-3/4'>
            <form
                onSubmit={submitReview}
                className='space-y-3'
            >
                <div className='flex items-center gap-1'>
                    <Input
                        name='rating'
                        type='number'
                        step={0.5}
                        min={1}
                        max={5}
                        placeholder='1'
                        className='w-[63px] rounded-xl border-gray-400'
                        value={formData.rating}
                        onChange={handleChange}
                    />
                    <StarIcon fill='orange' color='orange' className='w-5 h-5' />
                </div>
                <Textarea
                    name='content'
                    rows={4}
                    className='rounded-xl border-gray-400'
                    placeholder='What did you think about this place?'
                    value={formData.content}
                    onChange={handleChange}
                />
                <Button
                    type='submit'
                    className='bg-blue-400 text-white rounded-xl hover:opacity-75'
                >
                    Publish
                </Button>
            </form>
        </div>
    )
}
