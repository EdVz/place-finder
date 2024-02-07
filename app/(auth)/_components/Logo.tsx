import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';

const font = Poppins({
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
});

export const Logo = () => {
    return (
        <div className={cn("border border-gray-300 p-8 rounded-tl-2xl rounded-br-2xl ", font.className)}>
            <p className='text-lg font-medium text-center'>
                Placefinder
            </p>
            <p className='text-xs text-muted-foreground'>
                Discover New Places
            </p>
        </div>
    )
}
