import React from 'react'
import { Logo } from './Logo'
import { Search } from './Search'
import { Profile } from './profile'
import { CreatePlace } from './CreatePlace'

export const Navbar = () => {
    return (
        <nav className='fixed top-0 bg-white w-full h-20 flex px-2 lg:px-4 justify-between items-center shadow-md'>
            <Logo />
            <div className='flex lg:ml-24 gap-8'>
                <Search />
                <CreatePlace />
            </div>
            <Profile />
        </nav>
    )
}
