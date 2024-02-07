"use client"

import axios from "axios";
import { PlaceCard } from "./_components/PlaceCard";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { MapContainer } from "./_components/MapContainer";


export interface ImageType {
  url: string;
}

export interface Place {
  _id: string;
  name: string;
  images: ImageType[];
  location: string;
  rating: number;
  averageSpent: number;
  description: string;
}

export default function Home() {

  const { toast } = useToast();

  const [places, setPlaces] = useState<Place[] | null>(null);


  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get('/api/place');
        setPlaces(res.data);

      } catch (error) {
        return toast({
          variant: 'error',
          title: 'Failed to load places'
        });
      }
    }

    fetchPlaces();
  }, []);



  return (
    <div className="w-full mt-8 space-y-8">
      {places && (
        <MapContainer places={places} />
      )}
      <div className="flex flex-col lg:flex-row flex-wrap gap-3 justify-evenly">
        {places && places.map((place: Place) => (
          <PlaceCard
            key={place._id}
            id={place._id}
            name={place.name}
            images={place.images}
            location={place.location}
            rating={place.rating}
            averageSpent={place.averageSpent}
            description={place.description}
          />
        ))}
      </div>
    </div>
  )
}
