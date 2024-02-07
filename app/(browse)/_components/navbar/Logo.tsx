import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import React from 'react'

const font = Poppins({
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
});

export const Logo = () => {
    return (
        <Link href='/'>
            <div className={cn(font.className)}>
                <p className='text-lg font-medium'>
                    Placefinder
                </p>
                <p className='text-xs text-muted-foreground'>
                    Discover New Places
                </p>
            </div>
        </Link>
    )
}
