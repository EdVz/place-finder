import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, currentUser } from '@clerk/nextjs'
import React from 'react'

export const Profile = async () => {

    const user = await currentUser();
    return (
        <div className=''>
            {!user && (
                <div className='flex gap-2'>
                    <SignInButton>
                        <Button size='sm' variant='ghost'>
                            Login
                        </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button size='sm' className='primary text-white rounded-xl hover:opacity-75'>
                            Sign Up
                        </Button>
                    </SignUpButton>
                </div>
            )}
            {!!user && (
                <UserButton afterSignOutUrl='/' />
            )}
        </div>
    )
}
