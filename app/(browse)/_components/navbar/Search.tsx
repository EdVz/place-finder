"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { SearchIcon, X } from 'lucide-react';
import qs from 'query-string'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export const Search = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (!searchValue) return;

        const url = qs.stringifyUrl({
            url: '/places',
            query: { name: searchValue },
        }, { skipEmptyString: true });

        router.push(url);
    };

    const ClearInput = () => {
        setSearchValue('');
    };

    return (
        <form
            onSubmit={handleSearch}
            className='relative hidden lg:w-[400px] lg:flex lg:items-center'
        >
            <Input
                value={searchValue}
                onChange={(ev) => setSearchValue(ev.target.value)}
                placeholder='Search Places'
                className='rounded-full'
            />
            {searchValue && (
                <X
                    onClick={ClearInput}
                    className='absolute top-2.5 right-14 h-5 w-5 text-muted-foreground cursor-pointer'
                />
            )}
            <Button type='submit' size='sm' variant='ghost'>
                <SearchIcon className='h-5 w-5' />
            </Button>
        </form>
    )
}
