import React from 'react'
import { Navbar } from './_components/navbar';
import { Toaster } from '@/components/ui/toaster';

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            <div className='pt-20 px-5'>
                {children}
            </div>
            <Toaster />
        </div>
    );
};

export default BrowseLayout;
