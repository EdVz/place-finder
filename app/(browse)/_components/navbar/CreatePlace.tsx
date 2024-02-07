"use client"

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const CreatePlace = () => {
    const router = useRouter();

    const goToNewPlace = () => {
        router.refresh();
        router.push('/newplace');
    }

    return (
        <div>
            <Button
                onClick={goToNewPlace}
                size='sm'
                className='flex gap-1 bg-[#e0e0e0] rounded-xl hover:opacity-75'
            >
                Add New Place
                <PlusIcon className='h-5 w-5' />
            </Button>
        </div>
    )
}
