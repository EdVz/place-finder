import { StarIcon } from 'lucide-react'
import React from 'react'

export const AverageRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1">
            <span className="font-light">
                {rating}
            </span>
            <StarIcon className="w-4 h-4" fill="orange" color="orange" />
        </div>
    )
}
