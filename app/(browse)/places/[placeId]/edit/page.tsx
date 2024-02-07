import Place from "@/app/_models/Place";
import PlaceForm from "../../_components/PlaceForm";
import { Place as placeInterface } from "../../_components/PlaceDetails";

export default async function editPage({ params }: { params: { placeId: string } }) {

    const place: placeInterface | null = await Place.findById(params.placeId);

    return (
        <div>
            {place && (
                <PlaceForm
                    placeId={params.placeId}
                    placeName={place?.name}
                    placeLocation={place?.location}
                    placeAverageSpent={place?.averageSpent}
                    placeDescription={place?.description}
                    placeRating={place?.rating}
                    isEditForm
                />
            )}
        </div>
    );
}