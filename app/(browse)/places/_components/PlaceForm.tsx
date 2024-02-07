"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface PlaceFormProps {
    placeId?: string;
    placeName?: string;
    placeLocation?: string;
    placeAverageSpent?: number;
    placeDescription?: string;
    placeRating?: number;
    isEditForm?: boolean;
}

interface Image {
    type: string;
}
export default function PlaceForm({
    placeId,
    placeName,
    placeLocation,
    placeAverageSpent,
    placeDescription,
    placeRating,
    isEditForm = false,
}: PlaceFormProps) {

    const router = useRouter();
    const { toast } = useToast();

    const startingNewPlaceData = {
        name: placeName || '',
        location: placeLocation || '',
        averageSpent: placeAverageSpent || 0,
        images: [],
        description: placeDescription || '',
        rating: placeRating || 1,
    };

    const [formData, setFormData] = useState(startingNewPlaceData);
    const [pics, setPics] = useState<FileList | null>(null);

    const picsUpload = async (picList: any) => {
        const picsUrls: string[] = [];

        for (let pic of picList) {

            if (pic.type === "image/jpeg" || pic.type === "image/png") {
                const data = new FormData();

                data.append("file", pic);
                data.append("upload_preset", "place-finder");
                data.append("cloud_name", "dga5pvbco");
                try {
                    const res = await axios.post("https://api.cloudinary.com/v1_1/dga5pvbco/image/upload", data);
                    picsUrls.push(res.data.url.toString());

                } catch (error) {
                    console.error(error);
                    toast({
                        variant: 'error',
                        title: 'Something went wrong',
                    });
                }
            } else {
                toast({
                    variant: 'reminder',
                    title: 'Please, select only jpeg/png files',
                });
            }
        }
        return picsUrls;
    }

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = ev.target.name;
        const value = ev.target.value;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const submitNewPlace = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (!isEditForm) {
            if (!pics) {
                return toast({
                    variant: 'reminder',
                    title: 'Please, include some pictures',
                });
            }
        }
        if (
            !formData.name ||
            !formData.location ||
            !formData.averageSpent ||
            !formData.description ||
            !formData.rating
        ) {
            return toast({
                variant: 'reminder',
                title: "Please enter all the fields"
            });
        }

        try {

            if (!isEditForm) {
                const picUrlsPromise = picsUpload(pics);
                const picUrls = await picUrlsPromise;

                const { data } = await axios.post('/api/place', { ...formData, images: picUrls });

                router.push(`/places/${data.placeId}`);
                return toast({
                    variant: 'success',
                    title: 'Place created successfully',
                });
            } else {
                if (pics) {
                    const picUrlsPromise = picsUpload(pics);
                    const picUrls = await picUrlsPromise;
                    const { data } = await axios.put(`/api/place/${placeId}`, { ...formData, images: picUrls });

                    router.push(`/places/${data.placeId}`);
                } else {
                    const { data } = await axios.put(`/api/place/${placeId}`, { ...formData });
                    router.push(`/places/${data.placeId}`);
                }
                return toast({
                    variant: 'success',
                    title: 'Place updated successfully',
                });
            }

        } catch (error) {
            console.error(error);

            return toast({
                variant: 'error',
                title: 'Something went wrong. Please, try again',
            })
        }

    }

    return (
        <div className='flex justify-center mt-8'>
            <div className='w-full lg:w-1/2 flex flex-col items-center border shadow-xl py-4 rounded-xl'>
                <form onSubmit={submitNewPlace} className='w-3/4 space-y-4'>
                    <div>
                        <Label htmlFor='name'>
                            Place Name
                        </Label>
                        <Input
                            id='name'
                            name='name'
                            placeholder='Place Name'
                            className='rounded-xl border-gray-400'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='location'>
                            Location
                        </Label>
                        <Input
                            id='location'
                            name='location'
                            placeholder='Location'
                            className='rounded-xl border-gray-400'
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='averageSpent'>
                            Average Spent (USD)
                        </Label>
                        <Input
                            id='averageSpent'
                            name='averageSpent'
                            type='number'
                            min='0'
                            step='.01'
                            placeholder='Average Spent (USD)'
                            className='rounded-xl border-gray-400'
                            value={formData.averageSpent}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='image'>
                            Upload Images
                        </Label>
                        <Input
                            accept='image/*'
                            type='file'
                            multiple
                            onChange={e => setPics(e.target.files)}
                            className='rounded-xl border-gray-400 cursor-pointer'
                        />
                    </div>
                    <div>
                        <Label htmlFor='description'>
                            Description
                        </Label>
                        <Textarea
                            id='description'
                            name='description'
                            rows={6}
                            placeholder='Description'
                            className='rounded-xl border-gray-400'
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='rating'>
                            How would you rate this place? (1-5)
                        </Label>
                        <Input
                            type='number'
                            id='rating'
                            name='rating'
                            min='0'
                            max='5'
                            step='0.5'
                            placeholder='Select Rating'
                            className='rounded-xl border-gray-400'
                            value={formData.rating}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex justify-center'>
                        {isEditForm ? (
                            <Button
                                size='sm'
                                className='bg-green-500 text-white rounded-xl hover:opacity-75'
                            >
                                Update Place
                            </Button>

                        ) : (
                            <Button
                                size='sm'
                                className='bg-[#3772FF] text-white rounded-xl hover:opacity-75'
                            >
                                Create Place
                            </Button>
                        )}

                    </div>
                </form>
            </div>
        </div>
    )
}

